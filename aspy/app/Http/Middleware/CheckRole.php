<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        // Cargar el rol para asegurarnos de que esta disponible
        $user->loadMissing('role');
        
        $userRoleName = strtolower($user->role->name ?? '');
        $allowedRoles = array_map('strtolower', $roles);

        // Siempre permitir al administrador, y al rol especifico de la ruta
        if (!in_array($userRoleName, $allowedRoles) && $userRoleName !== 'admin') {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'Acceso denegado. Tu rol (' . $userRoleName . ') no tiene permisos para realizar esta accion.'
            ], 403);
        }

        return $next($request);
    }
}
