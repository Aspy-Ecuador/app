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
            'professional_id' => 'required|integer',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'name' => 'required|string',
        ]);

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
            'created_by' => $validated['professional_id'],
        ]);

        // Crear worker_schedule
        $workerSchedule = WorkerSchedule::create([
            'schedule_id' => $schedule->schedule_id,
            'professional_id' => $validated['professional_id'],
            'is_available' => true,
            'created_by' => $validated['professional_id'],
        ]);

        return response()->json([
            'message' => 'Horario creado correctamente',
            'schedule' => $schedule,
            'worker_schedule' => $workerSchedule,
        ], 201);
    }
}