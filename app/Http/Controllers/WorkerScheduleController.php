<?php

namespace App\Http\Controllers;

use App\Models\WorkerSchedule;
use Illuminate\Http\Request;
use Carbon\Carbon;

class WorkerScheduleController extends Controller
{
    public function index()
    {
        return WorkerSchedule::with(['schedule', 'person'])->get();
    }

    public function show($id)
    {
        return WorkerSchedule::with(['schedule', 'person'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Campos para Schedule
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'name' => 'nullable|string',

            // Campos para WorkerSchedule
            'person_id' => 'required|integer',
            'is_available' => 'required|boolean',
        ]);

        DB::beginTransaction();

        try {
            // Buscar Schedule existente con date, start_time, end_time (y opcionalmente name)
            $schedule = Schedule::where('date', $validated['date'])
                ->where('start_time', $validated['start_time'])
                ->where('end_time', $validated['end_time'])
                ->first();

            if (!$schedule) {
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
                'schedule_id' => $schedule->id,
                'person_id' => $validated['person_id'],
                'is_available' => $validated['is_available'],
            ];

            $workerSchedule = WorkerSchedule::create($workerScheduleData);

            DB::commit();

            return response()->json([
                'schedule' => $schedule,
                'worker_schedule' => $workerSchedule,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear worker schedule: ' . $e->getMessage()], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);
        $validated = $request->validate([
            'is_available' => 'boolean'
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

        $workerSchedule->update($validated);
        return $workerSchedule;
    }

    public function destroy($id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);
        $workerSchedule->delete();
        return response()->noContent();
    }
}
