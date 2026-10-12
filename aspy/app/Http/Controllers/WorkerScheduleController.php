<?php

namespace App\Http\Controllers;

use App\Models\Ajuste;
use App\Models\Appointment;
use App\Models\Aviso;
use App\Models\WorkerSchedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class WorkerScheduleController extends Controller
{
    private const CITA_GUARDADA = 1;

    private const CITA_AGENDADA = 2;

    private const CITA_CANCELADA = 5;

    // Los horarios se crean solo con POST /professional/create-horario (ProfessionalController), que aplica
    // el permiso de Secretaría y el límite de fechas que decide el Admin. Aquí no hay `store`.

    /**
     * Crear y quitar horarios: el Admin, cualquiera; un profesional, solo los suyos; Secretaría, cualquiera
     * pero solo si el Admin lo habilitó (ajuste `horario_secretaria`, el mismo permiso que para crearlos).
     * Aprobar un horario y cambiarle la modalidad NO depende de ese ajuste: ver `modalidad` y `aprobacion`.
     */
    private function canManage(WorkerSchedule $workerSchedule): bool
    {
        if ($this->isAdmin()) {
            return true;
        }
        if ($this->isProfessional()) {
            return (int) $workerSchedule->professional_id === $this->currentPersonId();
        }

        return $this->currentRoleId() === self::ROLE_STAFF && Ajuste::horarioSecretaria();
    }

    /** true si quien pregunta es el profesional dueño de ese horario. */
    private function esSuyo(WorkerSchedule $workerSchedule): bool
    {
        return $this->isProfessional() && (int) $workerSchedule->professional_id === $this->currentPersonId();
    }

    /**
     * Horarios que puede ver quien pregunta. Un horario que todavía no aprobó Secretaría (o el Admin)
     * no se ofrece: lo ven solo Secretaría, el Admin y el profesional que lo creó.
     */
    private function visibles(): Builder
    {
        $consulta = WorkerSchedule::with(['schedule', 'professional']);
        if ($this->isStaffOrAdmin()) {
            return $consulta;
        }
        if ($this->isProfessional()) {
            $yo = $this->currentPersonId();

            return $consulta->where(fn (Builder $q) => $q->where('aprobado', true)->orWhere('professional_id', $yo));
        }

        return $consulta->where('aprobado', true);
    }

    /**
     * El enlace de la reunión de un horario virtual lo ven Secretaría, el Admin y su profesional. El
     * paciente lo recibe por su cita, cuando el pago está aprobado (AppointmentController::datosVirtuales).
     */
    private function conEnlace(WorkerSchedule $workerSchedule): WorkerSchedule
    {
        if ($this->isStaffOrAdmin() || $this->esSuyo($workerSchedule)) {
            $workerSchedule->makeVisible('enlace_virtual');
        }

        return $workerSchedule;
    }

    public function index()
    {
        return $this->visibles()->get()->map(fn (WorkerSchedule $w) => $this->conEnlace($w))->values();
    }

    public function show($id)
    {
        return $this->conEnlace($this->visibles()->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);
        if (! $this->canManage($workerSchedule)) {
            return $this->forbidden();
        }
        $validated = $request->validate([
            'is_available' => 'boolean',
        ], [
            'is_available.boolean' => 'Indica si el horario queda disponible o no.',
        ]);

        // Un turno con una cita no se vuelve a ofrecer: otra persona lo reservaría encima. Se libera
        // cancelando la cita (o al rechazar su pago), que es cuando el sistema lo marca como disponible.
        if (filter_var($validated['is_available'] ?? false, FILTER_VALIDATE_BOOLEAN) && ! $workerSchedule->is_available) {
            $conCita = Appointment::where('worker_schedule_id', $workerSchedule->worker_schedule_id)
                ->where('appointment_status_id', '!=', self::CITA_CANCELADA)
                ->exists();
            if ($conCita) {
                return response()->json(['message' => 'Este horario tiene una cita. Para liberarlo hay que cancelar la cita.'], 422);
            }
        }

        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = auth()->id();

        $workerSchedule->update($validated);

        return $workerSchedule;
    }

    /**
     * Modalidad (presencial o virtual) y enlace de la reunión de un horario.
     *
     * - El profesional, solo en los suyos: elige la modalidad mientras nadie lo haya reservado (si ya
     *   estaba aprobado, vuelve a quedar por aprobar) y pone o edita el enlace cuando quiera.
     * - Secretaría y el Admin, en cualquiera y aunque ya tenga una cita: no depende del ajuste
     *   `horario_secretaria`, que es solo para crear y quitar horarios.
     *
     * Solo se toca lo que llega: sin `modalidad` no cambia la modalidad y sin `enlace` no cambia el enlace
     * (para quitarlo hay que mandarlo vacío). Un horario presencial no guarda enlace.
     */
    public function modalidad(Request $request, $id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);
        $esPersonal = $this->isStaffOrAdmin();
        if (! $esPersonal && ! $this->esSuyo($workerSchedule)) {
            return $this->forbidden();
        }

        $validated = $request->validate([
            'modalidad' => 'sometimes|required|string|in:'.implode(',', WorkerSchedule::MODALIDADES),
            'enlace' => 'sometimes|present|nullable|string|max:500',
        ], [
            'modalidad.required' => 'Elige si el horario es presencial o virtual.',
            'modalidad.in' => 'La modalidad debe ser presencial o virtual.',
            'enlace.string' => 'El enlace no es válido.',
            'enlace.max' => 'El enlace es demasiado largo.',
        ]);
        if (! array_key_exists('modalidad', $validated) && ! $request->has('enlace')) {
            return response()->json(['message' => 'Indica la modalidad o el enlace de la reunión.'], 422);
        }

        // La cita que ocupa el horario, si la hay (una cancelada ya lo dejó libre)
        $cita = Appointment::where('worker_schedule_id', $workerSchedule->worker_schedule_id)
            ->where('appointment_status_id', '!=', self::CITA_CANCELADA)
            ->first();
        if ($cita && ! in_array((int) $cita->appointment_status_id, [self::CITA_GUARDADA, self::CITA_AGENDADA], true)) {
            return response()->json(['message' => 'La cita de este horario ya se atendió: no se puede cambiar.'], 422);
        }

        $nueva = $validated['modalidad'] ?? $workerSchedule->modalidad;
        $cambiaModalidad = $nueva !== $workerSchedule->modalidad;
        if ($cambiaModalidad && ! $esPersonal && $cita) {
            return response()->json(['message' => 'Este horario ya tiene una cita. Pide a Secretaría que cambie la modalidad.'], 422);
        }

        $enlace = $request->has('enlace') ? trim((string) $request->input('enlace')) : (string) $workerSchedule->enlace_virtual;
        if ($nueva !== WorkerSchedule::VIRTUAL) {
            if ($request->has('enlace') && $enlace !== '') {
                return response()->json([
                    'message' => 'Un horario presencial no lleva enlace. Elige la modalidad virtual.',
                    'errors' => ['enlace' => ['Un horario presencial no lleva enlace. Elige la modalidad virtual.']],
                ], 422);
            }
            $enlace = '';
        } elseif ($request->has('enlace') && $enlace !== '' && Appointment::plataformaVirtual($enlace) === null) {
            return response()->json([
                'message' => Appointment::ENLACE_NO_VALIDO,
                'errors' => ['enlace' => [Appointment::ENLACE_NO_VALIDO]],
            ], 422);
        }

        $cambiaEnlace = (string) $workerSchedule->enlace_virtual !== $enlace;
        $workerSchedule->modalidad = $nueva;
        $workerSchedule->enlace_virtual = $enlace === '' ? null : $enlace;
        // Secretaría aprobó una modalidad concreta: si el profesional la cambia, hay que revisarlo otra vez
        if ($cambiaModalidad && ! $esPersonal && $workerSchedule->aprobado) {
            $workerSchedule->aprobado = false;
            $workerSchedule->aprobado_por = null;
            $workerSchedule->aprobado_el = null;
        }
        $workerSchedule->modified_by = auth()->id();
        $workerSchedule->save();

        Aviso::horarioCambiado($workerSchedule, $cambiaModalidad, $cambiaEnlace, $cita, $esPersonal);

        return response()->json($this->resumen($workerSchedule) + ['message' => $this->mensajeDeModalidad($workerSchedule, $cambiaModalidad, $esPersonal)]);
    }

    /**
     * Secretaría o el Admin aprueban un horario (desde entonces se ofrece a las familias) o le quitan la
     * aprobación (deja de ofrecerse). No se le quita a un horario que ya tiene una cita.
     */
    public function aprobacion(Request $request, $id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);
        $validated = $request->validate([
            'aprobado' => 'required|boolean',
        ], [
            'aprobado.required' => 'Indica si el horario queda aprobado.',
            'aprobado.boolean' => 'Indica si el horario queda aprobado.',
        ]);
        $aprobado = filter_var($validated['aprobado'], FILTER_VALIDATE_BOOLEAN);

        if (! $aprobado && ! $workerSchedule->is_available) {
            return response()->json(['message' => 'Este horario ya tiene una cita: no se le puede quitar la aprobación.'], 422);
        }

        $cambia = (bool) $workerSchedule->aprobado !== $aprobado;
        $workerSchedule->aprobado = $aprobado;
        $workerSchedule->aprobado_por = $aprobado ? auth()->id() : null;
        $workerSchedule->aprobado_el = $aprobado ? Carbon::now() : null;
        $workerSchedule->modified_by = auth()->id();
        $workerSchedule->save();

        if ($cambia) {
            Aviso::horarioAprobado($workerSchedule, $aprobado);
        }

        return response()->json($this->resumen($workerSchedule) + [
            'message' => $aprobado ? 'Horario aprobado: ya se ofrece para agendar.' : 'El horario quedó por aprobar y dejó de ofrecerse.',
        ]);
    }

    /** Lo que cambia de un horario, para quien acaba de editarlo (siempre alguien que puede ver el enlace). */
    private function resumen(WorkerSchedule $workerSchedule): array
    {
        return [
            'worker_schedule_id' => $workerSchedule->worker_schedule_id,
            'modalidad' => $workerSchedule->modalidad,
            'es_virtual' => $workerSchedule->esVirtual(),
            'enlace_virtual' => $workerSchedule->enlace_virtual,
            'plataforma' => Appointment::plataformaVirtual($workerSchedule->enlace_virtual),
            'aprobado' => (bool) $workerSchedule->aprobado,
        ];
    }

    private function mensajeDeModalidad(WorkerSchedule $workerSchedule, bool $cambioModalidad, bool $esPersonal): string
    {
        if ($cambioModalidad && ! $esPersonal) {
            return 'Modalidad cambiada. Secretaría tiene que aprobar el horario otra vez.';
        }
        if (! $workerSchedule->esVirtual()) {
            return 'El horario quedó como presencial.';
        }

        return $workerSchedule->enlace_virtual ? 'Horario virtual: enlace guardado.' : 'Horario virtual. Falta poner el enlace de la reunión.';
    }

    public function destroy($id)
    {
        $workerSchedule = WorkerSchedule::with('schedule')->findOrFail($id);
        if (! $this->canManage($workerSchedule)) {
            return $this->forbidden();
        }

        if (!$workerSchedule->is_available) {
            return response()->json(['message' => 'No se puede eliminar un horario ocupado'], 422);
        }

        $schedule = $workerSchedule->schedule;

        $workerSchedule->delete();
        $schedule->delete();

        return response()->noContent();
    }
}
