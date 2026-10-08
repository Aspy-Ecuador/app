<?php

namespace App\Http\Controllers;

use App\Models\AppointmentReport;
use App\Models\ArchivoPrivado;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AppointmentReportController extends Controller
{
    /**
     * Reportes de sesión (información clínica): el cliente ve los de sus citas,
     * el profesional los de las citas que atendió y el admin todos.
     */
    private function visibleReports(): Builder
    {
        $query = AppointmentReport::query();

        if ($this->isAdmin()) {
            return $query;
        }
        if (! $this->isProfessional() && ! $this->isClient()) {
            return $query->whereRaw('1 = 0');
        }

        $column = $this->isProfessional() ? 'professional_id' : 'client_id';

        return $query->whereHas('appointment', fn (Builder $q) => $q->where($column, $this->currentPersonId()));
    }

    public function index()
    {
        return $this->visibleReports()->with('appointment')->get();
    }

    public function show($id)
    {
        return $this->visibleReports()->with('appointment')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => 'required|integer|unique:appointment_report,appointment_id',
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
            'sign' => 'string',
        ]);

        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = auth()->id();

        $report->update($validated);

        return $report;
    }

    public function destroy($id)
    {
        $report = AppointmentReport::findOrFail($id);
        // El PDF se borra junto con el reporte: no queda información clínica suelta
        ArchivoPrivado::where('appointment_report_id', $report->appointment_report_id)->delete();
        $report->delete();

        return response()->noContent();
    }
}
