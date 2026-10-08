<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\ArchivoPrivado;
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
        // Los comprobantes de pagos rechazados se borran un día después del rechazo
        ArchivoPrivado::borrarProgramados();

        $payments = $this->visiblePayments()->with([
            'client.person.identification',
            'service',
            'paymentData',
            'paymentStatus',
            'receipt',
            'receipt.receiptStatus'
        ])->get();

        // Fecha en que se borrará el comprobante, si el pago fue rechazado y todavía se conserva
        $seBorran = ArchivoPrivado::whereNotNull('eliminar_el')
            ->whereIn('payment_data_id', $payments->pluck('payment_data_id')->filter())
            ->get(['payment_data_id', 'eliminar_el'])
            ->keyBy('payment_data_id');

        return $payments->map(function ($payment) use ($seBorran) {
            $data = $payment->toArray();
            $data['client'] = $payment->client?->person;
            $data['comprobante_se_borra_el'] = $seBorran->get($payment->payment_data_id)?->eliminar_el;
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