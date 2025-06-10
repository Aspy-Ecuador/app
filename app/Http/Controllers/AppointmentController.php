<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index()
    {
        return Appointment::with(['payment', 'scheduledBy', 'workerSchedule', 'status', 'trackingAppointment'])->get();
    }

    public function show($id)
    {
        return Appointment::with(['payment', 'scheduledBy', 'workerSchedule', 'status', 'trackingAppointment'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        // Validación para toda la información combinada (se puede ajustar según campos que envíes)
        $validated = $request->validate([
            // Campos para PaymentData
            'payment_data.type' => 'required|string',
            'payment_data.number' => 'required|integer',

            // Campos para Payment
            'payment.person_id' => 'required|integer',
            'payment.service_id' => 'required|integer',
            'payment.discount_id' => 'nullable|integer',
            'payment.service_price' => 'required|numeric|min:0',
            'payment.discount_percentage' => 'nullable|integer|min:0|max:100',
            'payment.total_amount' => 'required|numeric|min:0',

            // Campos para Appointment
            'scheduled_by' => 'required|integer',
            'worker_schedule_id' => 'required|integer|unique:appointments,worker_schedule_id',
            'tracking_appointment' => 'nullable|integer|unique:appointments,tracking_appointment',
            'status' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            // Crear PaymentData
            $paymentData = PaymentData::create($validated['payment_data']);

            // Crear Payment vinculando payment_data_id recién creado
            $paymentDataValidated = $validated['payment'];
            $paymentDataValidated['payment_data_id'] = $paymentData->id;
            $paymentDataValidated['status'] = 1; // Pendiente


            $payment = Payment::create($paymentDataValidated);

            // Crear Appointment vinculando payment_id recién creado
            $appointmentData = [
                'payment_id' => $payment->id,
                'scheduled_by' => $validated['scheduled_by'],
                'worker_schedule_id' => $validated['worker_schedule_id'],
                'tracking_appointment' => $validated['tracking_appointment'] ?? null,
            ];

            $appointmentData['status'] = 1; //Pendiente

            $appointment = Appointment::create($appointmentData);

            DB::commit();

            return response()->json([
                'payment_data' => $paymentData,
                'payment' => $payment,
                'appointment' => $appointment
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear cita: ' . $e->getMessage()], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $validated = $request->validate([
            'status' => 'integer'
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
