<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = UserAccount::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Update last login
        $user->last_login = now();
        $user->save();

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'token' => $token,
        ], 200);
    }

    /**
     * Get authenticated user data
     */
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user_id' => $user->user_id,
            'email' => $user->email,
            'role' => [
                'role_id' => $user->role->role_id,
                'name' => $user->role->name,
            ],
            'status' => [
                'status_id' => $user->accountStatus->status_id,
                'name' => $user->accountStatus->name,
            ],
            'last_login' => $user->last_login,
            'person' => $user->person ? [
                'person_id' => $user->person->person_id,
                'first_name' => $user->person->first_name,
                'last_name' => $user->person->last_name,
                'birthdate' => $user->person->birthdate,
                'gender' => $user->person->gender,
                'occupation' => $user->person->occupation,
                'marital_status' => $user->person->marital_status,
                'education' => $user->person->education,
            ] : null,
        ], 200);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso',
        ], 200);
    }
}