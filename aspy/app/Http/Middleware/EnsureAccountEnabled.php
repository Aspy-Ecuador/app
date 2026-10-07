<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Corta la sesión de una cuenta que el administrador deshabilitó mientras estaba conectada:
 * responde 403 con code "cuenta_deshabilitada" (el frontend cierra la sesión y lo explica)
 * y borra sus tokens. El login ya rechaza a las cuentas deshabilitadas.
 */
class EnsureAccountEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        // auth('sanctum') resuelve el token aunque la ruta aún no haya pasado por auth:sanctum
        $user = auth('sanctum')->user();

        if ($user && ! $user->is_available && ! $request->is('api/logout')) {
            $user->tokens()->delete();

            return response()->json([
                'code' => 'cuenta_deshabilitada',
                'message' => 'Tu cuenta está deshabilitada. Comunícate con el administrador de la fundación.',
            ], 403);
        }

        return $next($request);
    }
}
