<?php

namespace App\Http\Controllers;

use App\Models\Ajuste;
use App\Models\Appointment;
use App\Models\WorkerSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WorkerScheduleController extends Controller
{
    private const CITA_CANCELADA = 5;

    // Los horarios se crean solo con POST /professional/create-horario (ProfessionalController), que aplica
    // el permiso de Secretaría y el límite de fechas que decide el Admin. Aquí no hay `store`.

    /**
     * El Admin gestiona cualquier horario; un profesional, solo los suyos; Secretaría, cualquiera pero
     * solo si el Admin lo habilitó (ajuste `horario_secretaria`, el mismo permiso que para crearlos).
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

    public function index()
    {
        return WorkerSchedule::with(['schedule', 'professional'])->get();
    }

    public function show($id)
    {
        return WorkerSchedule::with(['schedule', 'professional'])->findOrFail($id);
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