<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments
     */
    public function index()
    {
        $payments = Payment::with([
            'client.person.userAccount',
            'service',
            'paymentData',
            'paymentStatus',
            'receipt',
        ])->get();

        return response()->json($payments->map(function ($payment) {
            return $this->formatPayment($payment);
        }), 200);
    }

    /**
     * Store a newly created payment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|exists:client,person_id',
            'service_id' => 'required|exists:service,service_id',
            'service_price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|exists:payment_status,status_id',
            // Payment data fields
            'payment_type' => 'required|string',
            'payment_number' => 'required|integer',
            'payment_file' => 'required|string|unique:payment_data,file',
        ]);

        DB::beginTransaction();
        try {
            // Create payment data first
            $paymentData = PaymentData::create([
                'type' => $validated['payment_type'],
                'number' => $validated['payment_number'],
                'file' => $validated['payment_file'],
                'created_by' => auth()->user()->email ?? 'system',
            ]);

            // Create payment
            $payment = Payment::create([
                'person_id' => $validated['person_id'],
                'service_id' => $validated['service_id'],
                'payment_data_id' => $paymentData->payment_data_id,
                'service_price' => $validated['service_price'],
                'total_amount' => $validated['total_amount'],
                'status' => $validated['status'],
                'created_by' => auth()->user()->email ?? 'system',
            ]);

            $payment->load([
                'client.person.userAccount',
                'service',
                'paymentData',
                'paymentStatus',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Pago creado exitosamente',
                'payment' => $this->formatPayment($payment),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el pago',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified payment
     */
    public function show($id)
    {
        $payment = Payment::with([
            'client.person.userAccount.role',
            'service',
            'paymentData',
            'paymentStatus',
            'receipt',
            'appointments.appointmentStatus',
        ])->findOrFail($id);

        return response()->json($this->formatPayment($payment), 200);
    }

    /**
     * Update the specified payment
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'service_price' => 'sometimes|numeric|min:0',
            'total_amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|exists:payment_status,status_id',
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $payment->update($validated);

        $payment->load([
            'client.person.userAccount',
            'service',
            'paymentData',
            'paymentStatus',
        ]);

        return response()->json([
            'message' => 'Pago actualizado exitosamente',
            'payment' => $this->formatPayment($payment),
        ], 200);
    }

    /**
     * Remove the specified payment
     */
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json([
            'message' => 'Pago eliminado exitosamente',
        ], 200);
    }

    /**
     * Format payment with cascading data
     */
    private function formatPayment($payment)
    {
        return [
            'payment_id' => $payment->payment_id,
            'service_price' => $payment->service_price,
            'total_amount' => $payment->total_amount,
            'client' => [
                'person_id' => $payment->client->person->person_id,
                'first_name' => $payment->client->person->first_name,
                'last_name' => $payment->client->person->last_name,
                'email' => $payment->client->person->userAccount->email ?? null,
                'role' => $payment->client->person->userAccount->role ? [
                    'role_id' => $payment->client->person->userAccount->role->role_id,
                    'name' => $payment->client->person->userAccount->role->name,
                ] : null,
            ],
            'service' => [
                'service_id' => $payment->service->service_id,
                'name' => $payment->service->name,
                'price' => $payment->service->price,
            ],
            'payment_data' => [
                'payment_data_id' => $payment->paymentData->payment_data_id,
                'type' => $payment->paymentData->type,
                'number' => $payment->paymentData->number,
                'file' => $payment->paymentData->file,
            ],
            'payment_status' => [
                'status_id' => $payment->paymentStatus->status_id,
                'name' => $payment->paymentStatus->name,
            ],
            'receipt' => $payment->receipt ? [
                'receipt_id' => $payment->receipt->receipt_id,
                'status' => $payment->receipt->status,
            ] : null,
            'created_by' => $payment->created_by,
            'creation_date' => $payment->creation_date,
            'modified_by' => $payment->modified_by,
            'modification_date' => $payment->modification_date,
        ];
    }
}