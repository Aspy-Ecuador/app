<?php

namespace App\Http\Controllers;

use App\Models\PaymentStatus;
use Illuminate\Http\Request;

class PaymentStatusController extends Controller
{
    public function index()
    {
        return PaymentStatus::all();
    }

    public function store(Request $request)
    {
        $status = PaymentStatus::create($request->all());
        return response()->json($status, 201);
    }

    public function show($id)
    {
        return PaymentStatus::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $status = PaymentStatus::findOrFail($id);
        $status->update($request->all());
        return response()->json($status, 200);
    }

    public function destroy($id)
    {
        PaymentStatus::destroy($id);
        return response()->json(null, 204);
    }
}
