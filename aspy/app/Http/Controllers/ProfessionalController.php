<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\WorkerSchedule;
use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    public function createHorario(Request $request)
    {
        $validated = $request->validate([
            'professional_id' => 'required|integer|exists:professional,person_id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i,H:i:s',
            'end_time' => 'required|date_format:H:i,H:i:s|after:start_time',
            'name' => 'required|string|max:150',
        ]);

        // Un profesional solo puede crear horarios para sí mismo
        if ($this->isProfessional() && (int) $validated['professional_id'] !== $this->currentPersonId()) {
            return $this->forbidden();
        }

        // Validar horarios solapados
        $existingSchedule = WorkerSchedule::query()
            ->join('schedule', 'worker_schedule.schedule_id', '=', 'schedule.schedule_id')
            ->where('worker_schedule.professional_id', $validated['professional_id'])
            ->where('schedule.date', $validated['date'])
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

        // Crear worker_schedule
        $workerSchedule = WorkerSchedule::create([
            'schedule_id' => $schedule->schedule_id,
            'professional_id' => $validated['professional_id'],
            'is_available' => true,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Horario creado correctamente',
            'schedule' => $schedule,
            'worker_schedule' => $workerSchedule,
        ], 201);
    }
}