<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Payment;
use App\Models\PaymentData;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with([
            'client.person',
            'professional.person',
            'workerSchedule.schedule',
            'appointmentStatus',
            'service'
        ])->get();

        return $appointments->map(function ($appointment) {
            return [
                'appointment_id' => $appointment->appointment_id,
                'appointment_status' => $appointment->appointmentStatus,
                'client' => $appointment->client->person,
                'professional' => $appointment->professional->person,
                'service' => $appointment->service,
                'worker_schedule' => $appointment->workerSchedule,
                'created_by' => $appointment->created_by,
                'modified_by' => $appointment->modified_by,
                'creation_date' => $appointment->creation_date,
                'modification_date' => $appointment->modification_date,
            ];
        });
    }

    public function show($id)
    {
        $appointment = Appointment::with(['client.person', 'professional.person', 'workerSchedule.schedule', 'appointmentStatus', 'service'])->findOrFail($id);
        return [
            'appointment_id' => $appointment->appointment_id,
            'appointment_status' => $appointment->appointment_status,
            'date' => $appointment->date,
            'client' => $appointment->client->person,
            'professional' => $appointment->professional->person,
            'service' => $appointment->service,
            'worker_schedule' => $appointment->worker_schedule,
            'created_by' => $appointment->created_by,
            'modified_by' => $appointment->modified_by,
            'creation_date' => $appointment->creation_date,
            'modification_date' => $appointment->modification_date,
        ];
    }

    public function store(Request $request)
    {
        // Validación para toda la información combinada (se puede ajustar según campos que envíes)
        $validated = $request->validate([
            // Campos para PaymentData
            'payment_data.type' => 'required|string',
            'payment_data.number' => 'required|integer',
            'payment_data.file' => 'nullable|string', // Tamaño máximo de 2MB

            // Campos para Payment
            'payment.person_id' => 'required|integer',
            'payment.service_id' => 'required|integer',
            'payment.discount_id' => 'nullable|integer',
            'payment.service_price' => 'required|numeric|min:0',
            'payment.discount_percentage' => 'nullable|integer|min:0|max:100',
            'payment.total_amount' => 'required|numeric|min:0',

            // Campos para Appointment
            'scheduled_by' => 'required|integer',
            'worker_schedule_id' => 'required|integer|unique:appointment,worker_schedule_id',
            'tracking_appointment' => 'nullable|integer|unique:appointment,tracking_appointment',
        ]);

        DB::beginTransaction();

        try {
            // Crear PaymentData
            $paymentData = PaymentData::create($validated['payment_data']);

            // Crear Payment vinculando payment_data_id recién creado
            $paymentDataValidated = $validated['payment'];
            $paymentDataValidated['payment_data_id'] = $paymentData->payment_data_id;
            $paymentDataValidated['status'] = 1; // Pendiente

            $payment = Payment::create($paymentDataValidated);

            // Crear Appointment vinculando payment_id recién creado
            $appointmentData = [
                'payment_id' => $payment->payment_id,
                'scheduled_by' => $validated['scheduled_by'],
                'worker_schedule_id' => $validated['worker_schedule_id'],
                'tracking_appointment' => $validated['tracking_appointment'] ?? null,
            ];

            $appointmentData['status'] = 1; // Pendiente

            $appointment = Appointment::create($appointmentData);

            DB::commit();

            return response()->json([
                'payment_data' => $paymentData,
                'payment' => $payment,
                'appointment' => $appointment,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['error' => 'Error al crear cita: '.$e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $validated = $request->validate([
            'status' => 'integer',
        ]);

        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

        $appointment->update($validated);

        return $appointment;
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->noContent();
    }
}
