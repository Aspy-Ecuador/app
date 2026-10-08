<?php

namespace App\Http\Controllers;

use App\Models\Ajuste;
use App\Models\Appointment;
use App\Models\ArchivoPrivado;
use App\Models\AppointmentReport;
use App\Models\Payment;
use App\Models\PaymentData;
use App\Models\ProfessionalService;
use App\Models\Receipt;
use App\Models\Service;
use App\Models\WorkerSchedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    // IDs de appointment_status
    private const STATUS_SAVED = 1;      // Guardada (pago pendiente de revisión)
    private const STATUS_SCHEDULED = 2;  // Agendada
    private const STATUS_ATTENDED = 3;   // Asistió
    private const STATUS_MISSED = 4;     // No asistió
    private const STATUS_CANCELLED = 5;  // Cancelada

    private const CLIENT_CANCEL_MIN_HOURS = 24;

    /**
     * Citas que un paciente puede tener esperando la revisión del pago. Sin un tope, una sola cuenta
     * podría reservar toda la agenda (cada cita ocupa un horario y guarda un comprobante).
     */
    private const MAX_CITAS_POR_REVISAR = 10;

    /** Citas visibles para el usuario actual. */
    private function visibleAppointments(): Builder
    {
        $query = Appointment::query();

        if ($this->isStaffOrAdmin()) {
            return $query;
        }
        if ($this->isProfessional()) {
            return $query->where('professional_id', $this->currentPersonId());
        }

        return $query->where('client_id', $this->currentPersonId());
    }

    public function index()
    {
        $appointments = $this->visibleAppointments()->with([
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
        $appointment = $this->visibleAppointments()
            ->with(['client.person', 'professional.person', 'workerSchedule.schedule', 'appointmentStatus', 'service'])
            ->findOrFail($id);

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
    }

    public function createAppointment(Request $request)
    {
        $validated = $request->validate([
            'client_id'          => 'required|integer|exists:client,person_id',
            'professional_id'    => 'required|integer|exists:professional,person_id',
            'service_id'         => 'required|integer|exists:service,service_id',
            'worker_schedule_id' => 'required|integer|exists:worker_schedule,worker_schedule_id',
            'payment_type'       => 'required|string|max:50',
            // Referencia al comprobante subido antes con POST /archivos ("privado:123")
            'payment_file'       => ['required', 'string', 'regex:/^privado:\d{1,9}$/'],
        ]);

        // Un cliente solo puede agendar citas para sí mismo
        if ($this->isClient() && (int) $validated['client_id'] !== $this->currentPersonId()) {
            return $this->forbidden();
        }

        $offersService = ProfessionalService::where('service_id', $validated['service_id'])
            ->where('professional_id', $validated['professional_id'])
            ->exists();
        if (! $offersService) {
            return response()->json(['message' => 'El profesional no ofrece este servicio.'], 422);
        }

        if ($this->isClient()) {
            $porRevisar = Appointment::where('client_id', $this->currentPersonId())->where('appointment_status_id', self::STATUS_SAVED)->count();
            if ($porRevisar >= self::MAX_CITAS_POR_REVISAR) {
                return response()->json([
                    'message' => "Ya tienes {$porRevisar} citas esperando la revisión del pago. Cuando la fundación las revise podrás agendar más.",
                ], 422);
            }
        }

        // El comprobante tiene que ser un archivo que esta misma cuenta acaba de subir y que nadie usó
        $comprobante = ArchivoPrivado::disponible($validated['payment_file'], ArchivoPrivado::COMPROBANTE, auth()->id());
        if (! $comprobante) {
            return response()->json(['message' => 'El comprobante no es válido. Vuelve a subirlo.'], 422);
        }

        DB::beginTransaction();

        try {
            // Bloquea el horario para evitar que dos personas reserven el mismo turno
            $workerSchedule = WorkerSchedule::lockForUpdate()->findOrFail($validated['worker_schedule_id']);

            if ((int) $workerSchedule->professional_id !== (int) $validated['professional_id'] || ! $workerSchedule->is_available) {
                DB::rollBack();
                return response()->json(['message' => 'El horario seleccionado ya no está disponible.'], 422);
            }

            // El paciente no agenda un turno que ya empezó. Secretaría sí puede registrar la cita de un
            // turno en curso (por ejemplo, alguien que llegó sin agendar).
            if ($this->isClient()) {
                $horario = $workerSchedule->schedule;
                $inicio = $horario ? Carbon::parse(substr((string) $horario->getRawOriginal('date'), 0, 10).' '.$horario->start_time) : null;
                if ($inicio && $inicio->isPast()) {
                    DB::rollBack();
                    return response()->json(['message' => 'Ese horario ya empezó. Elige otro.'], 422);
                }
            }

            $paymentData = PaymentData::create([
                'client_id'  => $validated['client_id'],
                'type'       => $validated['payment_type'],
                'file'       => $validated['payment_file'],
                'created_by' => auth()->id(),
                'creation_date' => now(),
            ]);

            if (! $comprobante->vincular('payment_data_id', $paymentData->payment_data_id)) {
                DB::rollBack();
                return response()->json(['message' => 'El comprobante no es válido. Vuelve a subirlo.'], 422);
            }

            $payment = Payment::create([
                'client_id'         => $validated['client_id'],
                'service_id'        => $validated['service_id'],
                'payment_data_id'   => $paymentData->payment_data_id,
                'payment_status_id' => 2,
                // Se guarda el precio de hoy: si el servicio cambia de precio, este pago no cambia
                'amount'            => Service::whereKey($validated['service_id'])->value('price'),
                'created_by'        => auth()->id(),
                'creation_date' => now(),
            ]);

            $appointment = Appointment::create([
                'payment_id'            => $payment->payment_id,
                'client_id'             => $validated['client_id'],
                'professional_id'       => $validated['professional_id'],
                'worker_schedule_id'    => $validated['worker_schedule_id'],
                'appointment_status_id' => self::STATUS_SAVED,
                'service_id'            => $validated['service_id'],
                'created_by'            => auth()->id(),
                'creation_date' => now(),
            ]);

            Receipt::create([
                'payment_id'        => $payment->payment_id,
                'receipt_status_id' => 2,
                'created_by'        => auth()->id(),
                'creation_date' => now(),
            ]);

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
            return $this->serverError('Failed to create appointment.', $e);
        }
    }

    // Rechazar cita (staff). El motivo es obligatorio: queda registrado en el pago y el paciente lo lee.
    public function rejectAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
            'motivo' => 'required|string|min:5|max:500',
        ], [
            'motivo.required' => 'Escribe el motivo del rechazo: el paciente lo va a leer.',
            'motivo.min' => 'El motivo es muy corto: explica por qué se rechaza el comprobante.',
            'motivo.max' => 'El motivo no puede pasar de 500 caracteres.',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            if ((int) $appointment->appointment_status_id !== self::STATUS_SAVED) {
                DB::rollBack();
                return response()->json(['message' => 'Solo se pueden rechazar citas pendientes de aprobación.'], 422);
            }

            $payment = $appointment->payment;
            $payment->payment_status_id = 3;
            $payment->motivo_rechazo = trim((string) $request->input('motivo'));
            $payment->modified_by = auth()->id();
            $payment->modification_date = now();
            $payment->save();

            if ($appointment->payment->receipt) {
                $appointment->payment->receipt->delete();
            }

            // El comprobante de un pago rechazado se conserva los días que eligió el Admin (por defecto uno,
            // por si el rechazo fue un error y alguien necesita recuperarlo) y después se borra del sistema
            // (ArchivoPrivado::borrarProgramados). Con 0 días no se borra nunca. El motivo queda siempre.
            $dias = Ajuste::comprobanteRechazadoDias();
            ArchivoPrivado::where('payment_data_id', $payment->payment_data_id)
                ->update(['eliminar_el' => $dias > 0 ? now()->addDays($dias) : null]);

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
            return $this->serverError('Failed to reject appointment.', $e);
        }
    }

    // Aprobar cita (staff)
    public function approveAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $appointment = Appointment::findOrFail($request->appointmentId);

            if ((int) $appointment->appointment_status_id !== self::STATUS_SAVED) {
                DB::rollBack();
                return response()->json(['message' => 'Solo se pueden aprobar citas pendientes de aprobación.'], 422);
            }

            $payment = $appointment->payment;
            $payment->payment_status_id = 1;
            $payment->modified_by = auth()->id();
            $payment->modification_date = now();
            $payment->save();

            $appointment->appointment_status_id = self::STATUS_SCHEDULED;
            $appointment->modified_by = auth()->id();
            $appointment->modification_date = now();
            $appointment->save();

            $receipt = $appointment->payment->receipt;
            if ($receipt) {
                $receipt->receipt_status_id = 1;
                $receipt->modified_by = auth()->id();
                $receipt->modification_date = now();
                $receipt->save();
            }

            DB::commit();

            return response()->json([
                'message'     => 'Appointment approved successfully.',
                'appointment' => $appointment->load(['payment.receipt', 'client', 'professional', 'service']),
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverError('Failed to approve appointment.', $e);
        }
    }

    // Asistió (profesional de la cita o staff)
    public function completeAppointment(Request $request)
    {
        return $this->markAttendance($request, self::STATUS_ATTENDED, 'Appointment completed successfully.');
    }

    // No asistió (profesional de la cita o staff)
    public function missedAppointment(Request $request)
    {
        return $this->markAttendance($request, self::STATUS_MISSED, 'Appointment marked as missed.');
    }

    private function markAttendance(Request $request, int $status, string $message)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        $appointment = Appointment::findOrFail($request->appointmentId);

        if (! $this->isStaffOrAdmin() && (int) $appointment->professional_id !== $this->currentPersonId()) {
            return $this->forbidden();
        }
        if (! in_array((int) $appointment->appointment_status_id, [self::STATUS_SCHEDULED, self::STATUS_ATTENDED, self::STATUS_MISSED], true)) {
            return response()->json(['message' => 'Solo se puede marcar la asistencia de citas agendadas.'], 422);
        }
        $start = $this->appointmentStart($appointment);
        if ($start && $start->isFuture()) {
            return response()->json(['message' => 'La asistencia se marca cuando la cita ya empezó.'], 422);
        }

        try {
            $appointment->appointment_status_id = $status;
            $appointment->modified_by = auth()->id();
            $appointment->modification_date = now();
            $appointment->save();

            return response()->json([
                'message'     => $message,
                'appointment' => $appointment,
            ], 200);

        } catch (\Exception $e) {
            return $this->serverError('Failed to update appointment.', $e);
        }
    }

    // Cancelar cita (cliente dueño con 24h de anticipación, o staff)
    public function cancelAppointment(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        $appointment = Appointment::with('workerSchedule.schedule')->findOrFail($request->appointmentId);

        if (! in_array((int) $appointment->appointment_status_id, [self::STATUS_SAVED, self::STATUS_SCHEDULED], true)) {
            return response()->json(['message' => 'Esta cita ya no se puede cancelar.'], 422);
        }

        if (! $this->isStaffOrAdmin()) {
            if ((int) $appointment->client_id !== $this->currentPersonId()) {
                return $this->forbidden();
            }

            $start = $this->appointmentStart($appointment);
            if (! $start || now()->diffInHours($start, false) <= self::CLIENT_CANCEL_MIN_HOURS) {
                return response()->json([
                    'message' => 'Solo puedes cancelar con más de 24 horas de anticipación.',
                ], 422);
            }
        }

        DB::beginTransaction();

        try {
            $appointment->appointment_status_id = self::STATUS_CANCELLED;
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
            return $this->serverError('Failed to cancel appointment.', $e);
        }
    }

    private function appointmentStart(Appointment $appointment): ?Carbon
    {
        $schedule = $appointment->workerSchedule?->schedule;
        if (! $schedule) {
            return null;
        }

        $date = substr((string) $schedule->getRawOriginal('date'), 0, 10);

        return Carbon::parse("{$date} {$schedule->start_time}");
    }

    // Reporte de sesión (solo el profesional de la cita)
    public function createReport(Request $request)
    {
        $request->validate([
            'appointmentId' => 'required|integer',
        ]);

        $appointment = Appointment::findOrFail($request->appointmentId);

        if (! $this->isAdmin() && (int) $appointment->professional_id !== $this->currentPersonId()) {
            return $this->forbidden();
        }

        $request->validate([
            // Referencia al PDF subido antes con POST /archivos ("privado:123")
            'file' => ['required', 'string', 'regex:/^privado:\d{1,9}$/'],
            'sign' => 'required|string|max:255',
        ]);

        if (AppointmentReport::where('appointment_id', $appointment->appointment_id)->exists()) {
            return response()->json(['message' => 'Esta cita ya tiene un reporte.'], 422);
        }

        // El reporte tiene que ser un PDF que esta misma cuenta acaba de subir y que nadie usó
        $archivo = ArchivoPrivado::disponible($request->input('file'), ArchivoPrivado::REPORTE, auth()->id());
        if (! $archivo) {
            return response()->json(['message' => 'El archivo del reporte no es válido. Vuelve a subirlo.'], 422);
        }

        DB::beginTransaction();

        try {
            $report = AppointmentReport::create([
                'appointment_id' => $appointment->appointment_id,
                'file'           => $archivo->referencia(),
                'sign'           => $request->input('sign'),
                'created_by'     => auth()->id(),
                'creation_date'  => now(),
            ]);

            if (! $archivo->vincular('appointment_report_id', $report->appointment_report_id)) {
                DB::rollBack();
                return response()->json(['message' => 'El archivo del reporte no es válido. Vuelve a subirlo.'], 422);
            }

            DB::commit();

            return response()->json([
                'message' => 'Report created successfully.',
                'report'  => $report,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverError('Failed to create report.', $e);
        }
    }
}
