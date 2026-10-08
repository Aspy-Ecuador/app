<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\WorkerSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkerScheduleController extends Controller
{
    /** Staff/admin gestionan cualquier horario; un profesional solo los suyos. */
    private function canManage(WorkerSchedule $workerSchedule): bool
    {
        return $this->isStaffOrAdmin()
            || ($this->isProfessional() && (int) $workerSchedule->professional_id === $this->currentPersonId());
    }

    public function index()
    {
        return WorkerSchedule::with(['schedule', 'professional'])->get();
    }

    public function show($id)
    {
        return WorkerSchedule::with(['schedule', 'professional'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Campos para Schedule
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'name' => 'nullable|string|max:150',

            // Campos para WorkerSchedule
            'person_id' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            // Buscar Schedule existente con date, start_time, end_time (y opcionalmente name)
            $schedule = Schedule::where('date', $validated['date'])
                ->where('start_time', $validated['start_time'])
                ->where('end_time', $validated['end_time'])
                ->first();

            if (! $schedule) {
                // Crear Schedule si no existe
                $scheduleData = [
                    'date' => $validated['date'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'name' => $validated['name'] ?? null,
                ];

                $schedule = Schedule::create($scheduleData);
            }

            // Crear WorkerSchedule asociado a schedule_id y person_id
            $workerScheduleData = [
                'schedule_id' => $schedule->schedule_id,
                'person_id' => $validated['person_id'],
                'is_available' => true, // Asignar is_available por defecto
                'creation_date' => Carbon::now(),
            ];

            $workerSchedule = WorkerSchedule::create($workerScheduleData);

            DB::commit();

            return response()->json([
                'schedule' => $schedule,
                'worker_schedule' => $workerSchedule,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->serverError('Error al crear worker schedule.', $e);
        }
    }

    public function update(Request $request, $id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);
        if (! $this->canManage($workerSchedule)) {
            return $this->forbidden();
        }
        $validated = $request->validate([
            'is_available' => 'boolean',
        ]);

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