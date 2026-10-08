<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\UserAccount;

class AuthController extends Controller
{
    /** Sesiones abiertas a la vez por cuenta (celular, computadora...). Al pasar de ahí se cierra la más antigua. */
    private const MAX_SESIONES = 10;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:150',
            'password' => 'required|string|max:255',
        ]);

        $user = UserAccount::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        if (!$user->is_available) {
            return response()->json([
                'code' => 'cuenta_deshabilitada',
                'message' => 'Tu cuenta está deshabilitada. Comunícate con el administrador de la fundación.',
            ], 403);
        }
        
        $user->last_login = now();
        $user->saveQuietly();

        // Sesiones: se borran las vencidas de esta cuenta y se conservan las 10 más recientes,
        // para que la tabla de sesiones no crezca sin fin con cada ingreso
        $vencimiento = (int) config('sanctum.expiration');
        if ($vencimiento) {
            $user->tokens()->where('created_at', '<', now()->subMinutes($vencimiento))->delete();
        }
        $sobran = $user->tokens()->orderByDesc('id')->skip(self::MAX_SESIONES - 1)->take(1000)->pluck('id');
        if ($sobran->isNotEmpty()) {
            $user->tokens()->whereIn('id', $sobran)->delete();
        }

        $token = $user->createToken('react-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user'       => [
                'user_account_id' => $user->user_account_id,
                'email'           => $user->email,
                'role'            => $user->role,
                'person'          => $user->person,
            ],
        ]);
    }


    public function user(Request $request)
    {
        $user = $request->user()->load([
            'role',
            'status',
            'person',
            'person.client',
            'person.professional',
            'person.staff',
            'person.identification',
            'person.gender',
            'person.occupation',
            'person.maritalStatus',
            'person.education',
            'person.address.city.state.country',
            'person.phone',

        ]);

        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    /**
     * Retorna el usuario autenticado actualmente.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'role',
            'status',
            'person.gender',
            'person.occupation',
            'person.phone',
            'person.address.city.state.country',
            'person.identification',
        ]);

        return response()->json($user);
    }
}