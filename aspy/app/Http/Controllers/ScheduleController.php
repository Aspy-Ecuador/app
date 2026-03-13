<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display a listing of schedules
     */
    public function index()
    {
        $schedules = Schedule::all();

        return response()->json($schedules->map(function ($schedule) {
            return $this->formatSchedule($schedule);
        }), 200);
    }

    /**
     * Store a newly created schedule
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'name' => 'required|string',
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $schedule = Schedule::create($validated);

        return response()->json([
            'message' => 'Horario creado exitosamente',
            'schedule' => $this->formatSchedule($schedule),
        ], 201);
    }

    /**
     * Display the specified schedule
     */
    public function show($id)
    {
        $schedule = Schedule::findOrFail($id);

        return response()->json($this->formatSchedule($schedule), 200);
    }

    /**
     * Update the specified schedule
     */
    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' => 'sometimes|date_format:H:i:s|after:start_time',
            'name' => 'sometimes|string',
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $schedule->update($validated);

        return response()->json([
            'message' => 'Horario actualizado exitosamente',
            'schedule' => $this->formatSchedule($schedule),
        ], 200);
    }

    /**
     * Remove the specified schedule
     */
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return response()->json([
            'message' => 'Horario eliminado exitosamente',
        ], 200);
    }

    /**
     * Format schedule (only schedule data, no relationships)
     */
    private function formatSchedule($schedule)
    {
        return [
            'schedule_id' => $schedule->schedule_id,
            'name' => $schedule->name,
            'date' => $schedule->date,
            'start_time' => $schedule->start_time,
            'end_time' => $schedule->end_time,
            'created_by' => $schedule->created_by,
            'creation_date' => $schedule->creation_date,
            'modified_by' => $schedule->modified_by,
            'modification_date' => $schedule->modification_date,
        ];
    }
}