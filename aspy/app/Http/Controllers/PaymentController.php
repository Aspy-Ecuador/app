<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /** Pagos visibles: staff/admin todos, cliente los suyos, profesional los de sus citas. */
    private function visiblePayments(): Builder
    {
        $query = Payment::query();

        if ($this->isStaffOrAdmin()) {
            return $query;
        }
        if ($this->isProfessional()) {
            return $query->whereIn(
                'payment_id',
                Appointment::where('professional_id', $this->currentPersonId())->select('payment_id')
            );
        }

        return $query->where('client_id', $this->currentPersonId());
    }

    public function index()
    {
        $payments = $this->visiblePayments()->with([
            'client.person.identification',
            'service',
            'paymentData',
            'paymentStatus',
            'receipt',
            'receipt.receiptStatus'
        ])->get();

        return $payments->map(function ($payment) {
            $data = $payment->toArray();
            $data['client'] = $payment->client?->person;
            return $data;
        });
    }

    public function show($id)
    {
        $payment = $this->visiblePayments()->with(['client', 'service', 'paymentData', 'paymentStatus', 'receipt'])->findOrFail($id);
        return [
            ...$payment->toArray(),
            'client' => $payment->client->person,
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|integer',
            'service_id' => 'required|integer',            
            'payment_data_id' => 'required|integer',
            'service_price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|integer',

        ]);

        return Payment::create($validated);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $validated = $request->validate([
            'status' => 'integer',
        ]);

        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = auth()->id();

        $payment->update($validated);

        return $payment;
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->noContent();
    }
}