<?php

namespace App\Http\Controllers;

use App\Models\AppointmentReport;
use Illuminate\Http\Request;

class AppointmentReportController extends Controller
{
    /**
     * Display a listing of appointment reports
     */
    public function index()
    {
        $reports = AppointmentReport::with([
            'appointment.appointmentStatus',
            'appointment.scheduler',
            'appointment.workerSchedule.person',
            'appointment.workerSchedule.schedule',
            'appointment.payment.client.person',
            'appointment.payment.service',
        ])->get();

        return response()->json($reports->map(function ($report) {
            return $this->formatReport($report);
        }), 200);
    }

    /**
     * Store a newly created appointment report
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointment,appointment_id|unique:appointment_report,appointment_id',
            'comments' => 'required|string',
            'sign' => 'required|string',
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $report = AppointmentReport::create($validated);

        $report->load([
            'appointment.appointmentStatus',
            'appointment.scheduler',
            'appointment.workerSchedule.person',
            'appointment.workerSchedule.schedule',
        ]);

        return response()->json([
            'message' => 'Reporte de cita creado exitosamente',
            'report' => $this->formatReport($report),
        ], 201);
    }

    /**
     * Display the specified appointment report
     */
    public function show($id)
    {
        $report = AppointmentReport::with([
            'appointment.appointmentStatus',
            'appointment.scheduler',
            'appointment.workerSchedule.person',
            'appointment.workerSchedule.schedule',
            'appointment.payment.client.person',
            'appointment.payment.service',
            'appointment.payment.paymentStatus',
        ])->findOrFail($id);

        return response()->json($this->formatReport($report), 200);
    }

    /**
     * Update the specified appointment report
     */
    public function update(Request $request, $id)
    {
        $report = AppointmentReport::findOrFail($id);

        $validated = $request->validate([
            'comments' => 'sometimes|string',
            'sign' => 'sometimes|string',
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $report->update($validated);

        $report->load([
            'appointment.appointmentStatus',
            'appointment.scheduler',
        ]);

        return response()->json([
            'message' => 'Reporte de cita actualizado exitosamente',
            'report' => $this->formatReport($report),
        ], 200);
    }

    /**
     * Remove the specified appointment report
     */
    public function destroy($id)
    {
        $report = AppointmentReport::findOrFail($id);
        $report->delete();

        return response()->json([
            'message' => 'Reporte de cita eliminado exitosamente',
        ], 200);
    }

    /**
     * Format report with cascading data
     */
    private function formatReport($report)
    {
        return [
            'appointment_report_id' => $report->appointment_report_id,
            'comments' => $report->comments,
            'sign' => $report->sign,
            'appointment' => [
                'appointment_id' => $report->appointment->appointment_id,
                'status' => [
                    'status_id' => $report->appointment->appointmentStatus->status_id,
                    'name' => $report->appointment->appointmentStatus->name,
                ],
                'scheduled_by' => [
                    'person_id' => $report->appointment->scheduler->person_id,
                    'first_name' => $report->appointment->scheduler->first_name,
                    'last_name' => $report->appointment->scheduler->last_name,
                ],
                'worker_schedule' => [
                    'worker_schedule_id' => $report->appointment->workerSchedule->worker_schedule_id,
                    'person' => [
                        'person_id' => $report->appointment->workerSchedule->person->person_id,
                        'first_name' => $report->appointment->workerSchedule->person->first_name,
                        'last_name' => $report->appointment->workerSchedule->person->last_name,
                    ],
                    'schedule' => [
                        'schedule_id' => $report->appointment->workerSchedule->schedule->schedule_id,
                        'name' => $report->appointment->workerSchedule->schedule->name,
                        'date' => $report->appointment->workerSchedule->schedule->date,
                        'start_time' => $report->appointment->workerSchedule->schedule->start_time,
                        'end_time' => $report->appointment->workerSchedule->schedule->end_time,
                    ],
                ],
                'payment' => $report->appointment->payment ? [
                    'payment_id' => $report->appointment->payment->payment_id,
                    'client' => [
                        'person_id' => $report->appointment->payment->client->person->person_id,
                        'first_name' => $report->appointment->payment->client->person->first_name,
                        'last_name' => $report->appointment->payment->client->person->last_name,
                    ],
                    'service' => [
                        'service_id' => $report->appointment->payment->service->service_id,
                        'name' => $report->appointment->payment->service->name,
                    ],
                    'payment_status' => $report->appointment->payment->paymentStatus ? [
                        'status_id' => $report->appointment->payment->paymentStatus->status_id,
                        'name' => $report->appointment->payment->paymentStatus->name,
                    ] : null,
                ] : null,
            ],
            'created_by' => $report->created_by,
            'creation_date' => $report->creation_date,
            'modified_by' => $report->modified_by,
            'modification_date' => $report->modification_date,
        ];
    }
}