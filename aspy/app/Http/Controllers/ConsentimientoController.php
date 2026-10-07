<?php

namespace App\Http\Controllers;

use App\Models\UserConsent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Aceptación de la política de privacidad por parte de la propia persona.
 *
 * Quien se registra solo la acepta en el registro. A quien la fundación le crea la cuenta desde
 * el panel no se le puede aceptar por él: la web se la muestra en su primer ingreso y no lo deja
 * continuar hasta que la acepte (o cierre sesión). Aplica a todos los roles.
 *
 * Siempre actúa sobre la cuenta de la sesión: no recibe ningún id, así que nadie puede aceptar
 * por otra persona.
 */
class ConsentimientoController extends Controller
{
    /** Versión vigente de la política. Si cambia el texto, súbela: todos deberán aceptarla de nuevo. */
    public const VERSION = '1.0';

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'pendiente' => ! $this->yaAcepto($request),
            'version' => self::VERSION,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'accepted_privacy_policy' => 'required|accepted',
            'policy_version' => 'required|string|in:'.self::VERSION,
        ]);

        if (! $this->yaAcepto($request)) {
            UserConsent::create([
                'user_id' => $request->user()->user_account_id,
                'policy_version' => self::VERSION,
                'ip_address' => $request->ip(),
                'accepted_at' => now(),
            ]);
        }

        return response()->json(['pendiente' => false, 'version' => self::VERSION], 201);
    }

    private function yaAcepto(Request $request): bool
    {
        return UserConsent::where('user_id', $request->user()->user_account_id)
            ->where('policy_version', self::VERSION)
            ->exists();
    }
}
