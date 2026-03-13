<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserAccountController extends Controller
{
    /**
     * Display a listing of user accounts
     */
    public function index()
    {
        $users = UserAccount::with([
            'role',
            'accountStatus',
            'person.client',
            'person.staff',
            'person.professional',
        ])->get();

        return response()->json($users->map(function ($user) {
            return $this->formatUserAccount($user);
        }), 200);
    }

    /**
     * Store a newly created user account
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:role,role_id',
            'email' => 'required|email|unique:user_account,email',
            'password' => 'required|string|min:8',
            'status' => 'required|exists:user_account_status,status_id',
        ]);

        $validated['password_hash'] = Hash::make($validated['password']);
        $validated['created_by'] = auth()->user()->email ?? 'system';
        unset($validated['password']);

        $user = UserAccount::create($validated);

        $user->load([
            'role',
            'accountStatus',
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $this->formatUserAccount($user),
        ], 201);
    }

    /**
     * Display the specified user account
     */
    public function show($id)
    {
        $user = UserAccount::with([
            'role',
            'accountStatus',
            'person.client',
            'person.staff',
            'person.professional.professionalServices.service',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
        ])->findOrFail($id);

        return response()->json($this->formatUserAccount($user), 200);
    }

    /**
     * Update the specified user account
     */
    public function update(Request $request, $id)
    {
        $user = UserAccount::findOrFail($id);

        $validated = $request->validate([
            'role_id' => 'sometimes|exists:role,role_id',
            'email' => 'sometimes|email|unique:user_account,email,' . $id . ',user_id',
            'password' => 'sometimes|string|min:8',
            'status' => 'sometimes|exists:user_account_status,status_id',
        ]);

        if (isset($validated['password'])) {
            $validated['password_hash'] = Hash::make($validated['password']);
            unset($validated['password']);
        }

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $user->update($validated);

        $user->load([
            'role',
            'accountStatus',
            'person',
        ]);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $this->formatUserAccount($user),
        ], 200);
    }

    /**
     * Remove the specified user account
     */
    public function destroy($id)
    {
        $user = UserAccount::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente',
        ], 200);
    }

    /**
     * Format user account with cascading data
     */
    private function formatUserAccount($user)
    {
        return [
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
                'is_client' => $user->person->client ? true : false,
                'is_staff' => $user->person->staff ? true : false,
                'is_professional' => $user->person->professional ? true : false,
                'professional_info' => $user->person->professional ? [
                    'specialty' => $user->person->professional->specialty,
                    'title' => $user->person->professional->title,                                        
                ] : null,
                'identifications' => $user->person->identifications ? [
                    'identification_id' => $user->person->identifications->identification_id,
                    'type' => $user->person->identifications->type,
                    'number' => $user->person->identifications->number,
                    'due_date' => $user->person->identifications->due_date,
                ] : null,                    
                'addresses' => $user->person->addresses ? [
                    'address_id' =>  $user->person->addresses->address_id,
                    'type' => $user->person->addresses->type,
                    'primary_address' => $user->person->addresses->primary_address,
                    'secondary_address' => $user->person->addresses->secondary_address,
                    'country' => [
                        'country_id' => $user->person->addresses->countryData->country_id,
                        'name' => $user->person->addresses->countryData->name,
                        'phone_code' => $user->person->addresses->countryData->phone_code,
                    ],
                    'state' => [
                        'state_id' => $user->person->addresses->state->state_id,
                        'name' => $user->person->addresses->state->name,
                    ],
                    'city' => [
                        'city_id' => $user->person->addresses->cityData->city_id,
                        'name' => $user->person->addresses->cityData->name,
                    ],
                ] : null,
                'phones' => $user->person->phones ? [
                    'phone_id' =>  $user->person->phones->phone_id,
                    'type' => $user->person->phones->type,
                    'number' => $user->person->phones->number,
                ] : null,                    
            ] : null,
            'created_by' => $user->created_by,
            'creation_date' => $user->creation_date,
            'modified_by' => $user->modified_by,
            'modification_date' => $user->modification_date,
        ];
    }
}