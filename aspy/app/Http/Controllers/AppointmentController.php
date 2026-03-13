<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of appointments
     */
    public function index()
    {
        $appointments = Appointment::with([
            'appointmentStatus',
            'scheduler.userAccount.role',
            'workerSchedule.person',
            'workerSchedule.schedule',
            'payment.client.person',
            'payment.service',
            'payment.paymentStatus',
            'payment.paymentData',
        ])->get();

        return response()->json($appointments->map(function ($appointment) {
            return $this->formatAppointment($appointment);
        }), 200);
    }

    /**
     * Store a newly created appointment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_id' => 'required|exists:payment,payment_id',
            'scheduled_by' => 'required|exists:person,person_id',
            'worker_schedule_id' => 'required|exists:worker_schedule,worker_schedule_id|unique:appointment,worker_schedule_id',
            'status' => 'required|exists:appointment_status,status_id',
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $appointment = Appointment::create($validated);

        $appointment->load([
            'appointmentStatus',
            'scheduler.userAccount.role',
            'workerSchedule.person',
            'workerSchedule.schedule',
            'payment.client.person',
            'payment.service',
            'payment.paymentStatus',
            'payment.paymentData',
        ]);

        return response()->json([
            'message' => 'Cita creada exitosamente',
            'appointment' => $this->formatAppointment($appointment),
        ], 201);
    }

    /**
     * Display the specified appointment
     */
    public function show($id)
    {
        $appointment = Appointment::with([
            'appointmentStatus',
            'scheduler.userAccount.role',
            'workerSchedule.person',
            'workerSchedule.schedule',
            'payment.client.person',
            'payment.service',
            'payment.paymentStatus',
            'payment.paymentData',
            'appointmentReport',
        ])->findOrFail($id);

        return response()->json($this->formatAppointment($appointment), 200);
    }

    /**
     * Update the specified appointment
     */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'payment_id' => 'sometimes|exists:payment,payment_id',
            'scheduled_by' => 'sometimes|exists:person,person_id',
            'worker_schedule_id' => 'sometimes|exists:worker_schedule,worker_schedule_id|unique:appointment,worker_schedule_id,' . $id . ',appointment_id',
            'status' => 'sometimes|exists:appointment_status,status_id',
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $appointment->update($validated);

        $appointment->load([
            'appointmentStatus',
            'scheduler.userAccount.role',
            'workerSchedule.person',
            'workerSchedule.schedule',
            'payment.client.person',
            'payment.service',
            'payment.paymentStatus',
            'payment.paymentData',
        ]);

        return response()->json([
            'message' => 'Cita actualizada exitosamente',
            'appointment' => $this->formatAppointment($appointment),
        ], 200);
    }

    /**
     * Remove the specified appointment
     */
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json([
            'message' => 'Cita eliminada exitosamente',
        ], 200);
    }

    /**
     * Format appointment with cascading data
     */
    private function formatAppointment($appointment)
    {
        return [
            'appointment_id' => $appointment->appointment_id,
            'status' => [
                'status_id' => $appointment->appointmentStatus->status_id,
                'name' => $appointment->appointmentStatus->name,
            ],
            'scheduled_by' => [
                'person_id' => $appointment->scheduler->person_id,
                'first_name' => $appointment->scheduler->first_name,
                'last_name' => $appointment->scheduler->last_name,
                'email' => $appointment->scheduler->userAccount->email ?? null,
                'role' => $appointment->scheduler->userAccount->role ? [
                    'role_id' => $appointment->scheduler->userAccount->role->role_id,
                    'name' => $appointment->scheduler->userAccount->role->name,
                ] : null,
            ],
            'worker_schedule' => [
                'worker_schedule_id' => $appointment->workerSchedule->worker_schedule_id,
                'is_available' => $appointment->workerSchedule->is_available,
                'person' => [
                    'person_id' => $appointment->workerSchedule->person->person_id,
                    'first_name' => $appointment->workerSchedule->person->first_name,
                    'last_name' => $appointment->workerSchedule->person->last_name,
                ],
                'schedule' => [
                    'schedule_id' => $appointment->workerSchedule->schedule->schedule_id,
                    'name' => $appointment->workerSchedule->schedule->name,
                    'date' => $appointment->workerSchedule->schedule->date,
                    'start_time' => $appointment->workerSchedule->schedule->start_time,
                    'end_time' => $appointment->workerSchedule->schedule->end_time,
                ],
            ],
            'payment' => [
                'payment_id' => $appointment->payment->payment_id,
                'service_price' => $appointment->payment->service_price,
                'total_amount' => $appointment->payment->total_amount,
                'client' => [
                    'person_id' => $appointment->payment->client->person->person_id,
                    'first_name' => $appointment->payment->client->person->first_name,
                    'last_name' => $appointment->payment->client->person->last_name,
                ],
                'service' => [
                    'service_id' => $appointment->payment->service->service_id,
                    'name' => $appointment->payment->service->name,
                    'price' => $appointment->payment->service->price,
                ],
                'payment_status' => [
                    'status_id' => $appointment->payment->paymentStatus->status_id,
                    'name' => $appointment->payment->paymentStatus->name,
                ],
                'payment_data' => [
                    'payment_data_id' => $appointment->payment->paymentData->payment_data_id,
                    'type' => $appointment->payment->paymentData->type,
                    'number' => $appointment->payment->paymentData->number,
                    'file' => $appointment->payment->paymentData->file,
                ],
            ],
            'appointment_report' => $appointment->appointmentReport ? [
                'appointment_report_id' => $appointment->appointmentReport->appointment_report_id,
                'comments' => $appointment->appointmentReport->comments,
                'sign' => $appointment->appointmentReport->sign,
            ] : null,
            'created_by' => $appointment->created_by,
            'creation_date' => $appointment->creation_date,
            'modified_by' => $appointment->modified_by,
            'modification_date' => $appointment->modification_date,
        ];
    }
}