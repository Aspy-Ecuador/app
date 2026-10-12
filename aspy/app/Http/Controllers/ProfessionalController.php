<?php

namespace App\Http\Controllers;

use App\Models\Ajuste;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\WorkerSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    private const DURACION_MINIMA_MINUTOS = 10;

    private const SECRETARIA_SIN_PERMISO = 'La administración no habilitó que Secretaría gestione los horarios de los profesionales.';

    /**
     * Reglas vigentes para crear horarios, según quien pregunta. La web las usa para limitar el
     * calendario y explicar el límite; quien manda es `createHorario`, que las vuelve a aplicar.
     */
    public function reglasHorario()
    {
        return response()->json([
            'alcance' => $this->isAdmin() ? null : Ajuste::horarioAlcance(),
            'desde' => Carbon::today()->toDateString(),
            'hasta' => $this->ultimoDiaPermitido()->toDateString(),
            // El profesional gestiona los suyos; Secretaría, solo si el Admin lo habilitó; el Admin, siempre
            'puede_gestionar' => ! $this->secretariaSinPermiso(),
            'secretaria_puede' => Ajuste::horarioSecretaria(),
        ]);
    }

    public function createHorario(Request $request)
    {
        // Secretaría crea horarios solo si el Admin lo habilitó (ajuste `horario_secretaria`)
        if ($this->secretariaSinPermiso()) {
            return $this->forbidden(self::SECRETARIA_SIN_PERMISO);
        }

        // Hasta cuándo se puede planificar lo decide el Admin (ajuste `horario_alcance`). Sin un tope,
        // la agenda se llenaría de horarios lejanos que nadie va a cumplir.
        $hasta = $this->ultimoDiaPermitido();

        $validated = $request->validate([
            'professional_id' => 'required|integer|exists:professional,person_id',
            // Solo AAAA-MM-DD: con otros formatos que la regla `date` acepta, la fecha validada y la guardada no coincidían
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today', 'before_or_equal:'.$hasta->toDateString()],
            'start_time' => 'required|date_format:H:i,H:i:s',
            'end_time' => 'required|date_format:H:i,H:i:s',
            'name' => 'required|string|max:150',
            // Presencial o virtual: la elige quien crea el horario (si no llega, presencial)
            'modalidad' => 'sometimes|required|string|in:'.implode(',', WorkerSchedule::MODALIDADES),
            'enlace' => 'sometimes|nullable|string|max:500',
        ], [
            'professional_id.required' => 'Indica de qué profesional es el horario.',
            'professional_id.exists' => 'Ese profesional no existe.',
            'date.required' => 'Elige la fecha del horario.',
            'date.date_format' => 'La fecha debe tener el formato AAAA-MM-DD.',
            'start_time.required' => 'Elige la hora de inicio.',
            'start_time.date_format' => 'La hora de inicio no es válida.',
            'end_time.required' => 'Elige la hora de fin.',
            'end_time.date_format' => 'La hora de fin no es válida.',
            'name.required' => 'Falta el nombre del turno.',
            'modalidad.required' => 'Elige si el horario es presencial o virtual.',
            'modalidad.in' => 'La modalidad debe ser presencial o virtual.',
            'enlace.string' => 'El enlace no es válido.',
            'enlace.max' => 'El enlace es demasiado largo.',
            'date.after_or_equal' => 'No se pueden crear horarios en fechas que ya pasaron.',
            'date.before_or_equal' => $hasta->isToday()
                ? 'Por ahora solo se pueden crear horarios para hoy. Ese límite lo define la administración.'
                : 'Solo se pueden crear horarios hasta el '.$hasta->format('d/m/Y').'. Ese límite lo define la administración.',
        ]);

        // Las horas llegan como "09:00" o "09:00:00": se llevan a un solo formato antes de compararlas y
        // guardarlas (mezcladas, "10:00" y "09:00:00" pasaban como si la segunda fuera posterior)
        $segundos = fn (string $hora) => array_sum(array_map(fn ($parte, $peso) => (int) $parte * $peso, explode(':', strlen($hora) === 5 ? $hora.':00' : $hora), [3600, 60, 1]));
        $validated['start_time'] = strlen($validated['start_time']) === 5 ? $validated['start_time'].':00' : $validated['start_time'];
        $validated['end_time'] = strlen($validated['end_time']) === 5 ? $validated['end_time'].':00' : $validated['end_time'];
        $duracion = $segundos($validated['end_time']) - $segundos($validated['start_time']);
        if ($duracion <= 0) {
            return $this->horaInvalida('La hora de fin debe ser mayor a la hora de inicio.');
        }
        // Un turno de menos de 10 minutos no es una cita: sin este mínimo se podrían crear miles en un día
        if ($duracion < self::DURACION_MINIMA_MINUTOS * 60) {
            return $this->horaInvalida('Un horario dura como mínimo '.self::DURACION_MINIMA_MINUTOS.' minutos.');
        }

        // Un profesional solo puede crear horarios para sí mismo
        if ($this->isProfessional() && (int) $validated['professional_id'] !== $this->currentPersonId()) {
            return $this->forbidden();
        }

        // Modalidad y enlace de la reunión (solo los horarios virtuales lo llevan; puede ponerse después)
        $modalidad = $validated['modalidad'] ?? WorkerSchedule::PRESENCIAL;
        $enlace = trim((string) ($validated['enlace'] ?? ''));
        if ($enlace !== '') {
            $error = $modalidad !== WorkerSchedule::VIRTUAL
                ? 'Un horario presencial no lleva enlace. Elige la modalidad virtual.'
                : (Appointment::plataformaVirtual($enlace) === null ? Appointment::ENLACE_NO_VALIDO : null);
            if ($error) {
                return response()->json(['message' => $error, 'errors' => ['enlace' => [$error]]], 422);
            }
        }

        // Validar horarios solapados
        $existingSchedule = WorkerSchedule::query()
            ->join('schedule', 'worker_schedule.schedule_id', '=', 'schedule.schedule_id')
            ->where('worker_schedule.professional_id', $validated['professional_id'])
            // whereDate compara solo el día: en SQLite la fecha se guarda con hora y un "=" nunca coincidía
            ->whereDate('schedule.date', $validated['date'])
            ->where(function ($query) use ($validated) {
                $query->where('schedule.start_time', '<', $validated['end_time'])
                      ->where('schedule.end_time', '>', $validated['start_time']);
            })
            ->exists();

        if ($existingSchedule) {
            return response()->json([
                'message' => 'Ya existe un horario solapado para este profesional'
            ], 422);
        }

        // Crear schedule
        $schedule = Schedule::create([
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'name' => $validated['name'],
            'created_by' => auth()->id(),
        ]);

        // Crear worker_schedule. El que crea un profesional queda por aprobar: Secretaría o el Admin lo
        // revisan antes de que se ofrezca a las familias. El que crean ellos ya nace aprobado.
        $aprobado = $this->isStaffOrAdmin();
        $workerSchedule = WorkerSchedule::create([
            'schedule_id' => $schedule->schedule_id,
            'professional_id' => $validated['professional_id'],
            'is_available' => true,
            'modalidad' => $modalidad,
            'enlace_virtual' => $enlace === '' ? null : $enlace,
            'aprobado' => $aprobado,
            'aprobado_por' => $aprobado ? auth()->id() : null,
            'aprobado_el' => $aprobado ? Carbon::now() : null,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => $aprobado ? 'Horario creado correctamente' : 'Horario creado. Secretaría lo revisará antes de publicarlo.',
            'schedule' => $schedule,
            // Quien lo crea siempre puede ver su enlace
            'worker_schedule' => $workerSchedule->makeVisible('enlace_virtual'),
        ], 201);
    }

    private function horaInvalida(string $mensaje)
    {
        return response()->json(['message' => $mensaje, 'errors' => ['end_time' => [$mensaje]]], 422);
    }

    /** Secretaría (no el Admin) sin el permiso del ajuste `horario_secretaria`. */
    private function secretariaSinPermiso(): bool
    {
        return $this->currentRoleId() === self::ROLE_STAFF && ! Ajuste::horarioSecretaria();
    }

    private function ultimoDiaPermitido(): Carbon
    {
        return $this->isAdmin() ? Carbon::today()->addDays(Ajuste::HORARIO_TOPE_ADMIN_DIAS) : Ajuste::horarioHasta();
    }
}
