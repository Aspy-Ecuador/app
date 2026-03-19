<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\UserAccount;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
    
        $user = UserAccount::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {

        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }
    
        $token = $user->createToken('react-token')->plainTextToken;
    
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
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
            'person.phone',
            
        ]);

        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
