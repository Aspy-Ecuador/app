<?php

namespace App\Http\Controllers;

use App\Models\AppointmentReport;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentReportController extends Controller
{
    public function index()
    {
        return AppointmentReport::with('appointment')->get();
    }

    public function show($id)
    {
        return AppointmentReport::with('appointment')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => 'required|integer|unique:appointment_reports,appointment_id',
            'comments' => 'required|string',
            'sign' => 'required|string',
            
        ]);

        return AppointmentReport::create($validated);
    }

    public function update(Request $request, $id)
    {
        $report = AppointmentReport::findOrFail($id);
        $validated = $request->validate([
            'comments' => 'string',
            'sign' => 'string'
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

        $report->update($validated);
        return $report;
    }

    public function destroy($id)
    {
        $report = AppointmentReport::findOrFail($id);
        $report->delete();
        return response()->noContent();
    }
}
