<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Payment;
use App\Models\PaymentData;
use App\Models\Receipt;
use App\Models\WorkerSchedule;
use App\Models\AppointmentReport;
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
                'payment_id' => $appointment->payment_id,
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

    public function createAppointment(Request $request)
    {
        $request->validate([
            'client_id'       => 'required|integer',
            'professional_id' => 'required|integer',
            'service_id'      => 'required|integer',
            'worker_schedule_id' => 'required|integer',
            'payment_type'    => 'required|string',
            'payment_file'    => 'required|string',
        ]);

        DB::beginTransaction();
        
        try {
            $paymentData = PaymentData::create([
                'client_id'  => $request->client_id,
                'type'       => $request->payment_type,
                'file'       => $request->payment_file,
                'created_by' => auth()->id(),
                'creation_date' => now(),         
            ]);

            $payment = Payment::create([
                'client_id'         => $request->client_id,
                'service_id'        => $request->service_id,
                'payment_data_id'   => $paymentData->payment_data_id,
                'payment_status_id' => 2,
                'created_by'        => auth()->id(),
                'creation_date' => now(),               
            ]);

            $appointment = Appointment::create([
                'payment_id'            => $payment->payment_id,
                'client_id'             => $request->client_id,
                'professional_id'       => $request->professional_id,
                'worker_schedule_id'    => $request->worker_schedule_id,
                'appointment_status_id' => 1,
                'service_id'            => $request->service_id,
                'created_by'            => auth()->id(),       
                'creation_date' => now(),         
            ]);

            $receipt = Receipt::create([
                'payment_id'        => $payment->payment_id,
                'receipt_status_id' => 2,
                'created_by'        => auth()->id(), 
                'creation_date' => now(),               
            ]);

            $workerSchedule = WorkerSchedule::findOrFail($request->worker_schedule_id);
            $workerSchedule->is_available = false;
            $workerSchedule->modified_by = auth()->id();
            $workerSchedule->modification_date = now();
            $workerSchedule->save();

            DB::commit();

            return response()->json([
                'message'     => 'Appointment created successfully.',
                'appointment' => $appointment->load(['payment', 'client', 'professional', 'workerSchedule', 'service']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create appointment.',
                'error'   => $e->getMessage(),
            ], 500);
        }            
    }

    // Rechazar cita
    public function rejectAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            $payment = $appointment->payment;
            $payment->payment_status_id = 3;
            $payment->modified_by = auth()->id();
            $payment->modification_date = now();
            $payment->save();

            if ($appointment->payment->receipt) {
                $appointment->payment->receipt->delete();
            }

            $workerSchedule = WorkerSchedule::findOrFail($appointment->worker_schedule_id);
            $workerSchedule->is_available = true;
            $workerSchedule->modified_by = auth()->id();
            $workerSchedule->modification_date = now();
            $workerSchedule->save();

            $appointment->delete();

            DB::commit();

            return response()->json([
                'message' => 'Appointment rejected successfully.',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to reject appointment.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // Aprobar cita
    public function approveAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            $payment = $appointment->payment;
            $payment->payment_status_id = 1;
            $payment->modified_by = auth()->id();
            $payment->modification_date = now();
            $payment->save();

            $appointment->appointment_status_id = 2;
            $appointment->modified_by = auth()->id();
            $appointment->modification_date = now();
            $appointment->save();

            $receipt = $appointment->payment->receipt;
            $receipt->receipt_status_id = 1;
            $receipt->modified_by = auth()->id();
            $receipt->modification_date = now();
            $receipt->save();

            DB::commit();

            return response()->json([
                'message'     => 'Appointment approved successfully.',
                'appointment' => $appointment->load(['payment.receipt', 'client', 'professional', 'service']),
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to approve appointment.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // Asistió
    public function completeAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            $appointment->appointment_status_id = 3;
            $appointment->modified_by = auth()->id();
            $appointment->modification_date = now();
            $appointment->save();

            DB::commit();

            return response()->json([
                'message'     => 'Appointment completed successfully.',
                'appointment' => $appointment,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to complete appointment.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // No asistió
    public function missedAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            $appointment->appointment_status_id = 4;
            $appointment->modified_by = auth()->id();
            $appointment->modification_date = now();
            $appointment->save();

            DB::commit();

            return response()->json([
                'message'     => 'Appointment marked as missed.',
                'appointment' => $appointment,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to mark appointment as missed.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // Cancelar cita
    public function cancelAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            $appointment->appointment_status_id = 5;
            $appointment->modified_by = auth()->id();
            $appointment->modification_date = now();
            $appointment->save();

            $workerSchedule = WorkerSchedule::findOrFail($appointment->worker_schedule_id);
            $workerSchedule->is_available = true;
            $workerSchedule->modified_by = auth()->id();
            $workerSchedule->modification_date = now();
            $workerSchedule->save();

            DB::commit();

            return response()->json([
                'message'     => 'Appointment cancelled successfully.',
                'appointment' => $appointment,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to cancel appointment.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    
    public function createReport(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
            'file'          => 'required|string',
            'sign'          => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            $report = AppointmentReport::create([
                'appointment_id' => $request->appointmentId,
                'file'       => $request->file,
                'sign'           => $request->sign,
                'created_by'     => auth()->id(),
                'creation_date'  => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Report created successfully.',
                'report'  => $report,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create report.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}