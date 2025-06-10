<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    public function index()
    {
        $receipts = Receipt::all();
        return response()->json($receipts);
    }

    public function show($id)
    {
        $receipt = Receipt::find($id);
        if (!$receipt) {
            return response()->json(['message' => 'Recibo no encontrado'], 404);
        }
        return response()->json($receipt);
    }

    public function store(Request $request)
    {
        $receipt = Receipt::create($request->all());
        return response()->json($receipt, 201);
    }

    public function update(Request $request, $id)
    {
        $receipt = Receipt::find($id);
        if (!$receipt) {
            return response()->json(['message' => 'Recibo no encontrado'], 404);
        }
        $receipt->update($request->all());
        return response()->json($receipt);
    }

    public function destroy($id)
    {
        $receipt = Receipt::find($id);
        if (!$receipt) {
            return response()->json(['message' => 'Recibo no encontrado'], 404);
        }
        $receipt->delete();
        return response()->json(['message' => 'Recibo eliminado']);
    }
}
