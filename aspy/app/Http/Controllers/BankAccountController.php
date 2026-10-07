<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use Illuminate\Http\Request;

/**
 * Datos bancarios para pagar por transferencia.
 * - Cualquier usuario con sesión los lee (los necesita para pagar una cita).
 * - Solo el Admin los cambia (la ruta usa role:admin).
 */
class BankAccountController extends Controller
{
    public function show()
    {
        return response()->json(BankAccount::query()->orderBy('bank_account_id')->first());
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:80',
            'account_type' => 'required|in:Ahorros,Corriente',
            'account_number' => ['required', 'string', 'max:30', 'regex:/^[0-9-]{5,30}$/'],
            'holder_name' => 'required|string|max:120',
            'holder_id' => ['required', 'string', 'regex:/^[0-9]{10,13}$/'],
        ], [
            'account_number.regex' => 'El número de cuenta solo puede tener números (y guiones).',
            'holder_id.regex' => 'La cédula o el RUC debe tener entre 10 y 13 números.',
        ]);

        $cuenta = BankAccount::query()->orderBy('bank_account_id')->first() ?? new BankAccount();
        $cuenta->fill([
            ...$validated,
            'modified_by' => auth()->id(),
            'modification_date' => now(),
        ])->save();

        return response()->json(['message' => 'Datos bancarios guardados.', 'bank_account' => $cuenta]);
    }
}
