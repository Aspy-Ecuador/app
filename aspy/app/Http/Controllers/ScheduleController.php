<?php
// FINAL
namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::all();
        return response()->json($schedules);
    }

    public function show($id)
    {
        $schedule = Schedule::find($id);
 
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }
 
        return response()->json($schedule);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'       => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time'   => 'required|date_format:H:i:s|after:start_time',
            'name'       => 'nullable|string|max:150',            
        ]);
 
        $validated['created_by'] = 1;

        $schedule = Schedule::create($validated);
 
        return response()->json($schedule, 201);
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::find($id);
 
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }
 
        $validated = $request->validate([
            'date'        => 'sometimes|required|date',
            'start_time'  => 'sometimes|required|date_format:H:i:s',
            'end_time'    => 'sometimes|required|date_format:H:i:s|after:start_time',
            'name'        => 'nullable|string|max:150',            
        ]);
         
        $validated['modified_by'] = 1;

        $schedule->update($validated);

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        $schedule = Schedule::find($id);
 
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }
 
        $schedule->delete();
 
        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}
