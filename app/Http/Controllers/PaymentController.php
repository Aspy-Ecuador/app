<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with(['person', 'service', 'discount', 'paymentData', 'status'])->get();
    }

    public function show($id)
    {
        return Payment::with(['person', 'service', 'discount', 'paymentData', 'status'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|integer',
            'service_id' => 'required|integer',
            'discount_id' => 'nullable|integer',
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
            'status' => 'integer'
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

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
