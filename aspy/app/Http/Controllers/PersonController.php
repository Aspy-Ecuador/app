<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;

class PersonController extends Controller
{
    /**
     * Display a listing of persons
     */
    public function index()
    {
        $persons = Person::with([
            'userAccount.role',
            'userAccount.accountStatus',
            'client',
            'staff',
            'professional',
            'identifications',
            'addresses.countryData',
            'addresses.state',
            'addresses.cityData',
            'phones',
        ])->get();

        return response()->json($persons->map(function ($person) {
            return $this->formatPerson($person);
        }), 200);
    }

    /**
     * Store a newly created person
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:user_account,user_id|unique:person,user_id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'gender' => 'required|string',
            'occupation' => 'required|string',
            'marital_status' => 'required|string',
            'education' => 'required|string',
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $person = Person::create($validated);

        $person->load([
            'userAccount.role',
            'userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Persona creada exitosamente',
            'person' => $this->formatPerson($person),
        ], 201);
    }

    /**
     * Display the specified person
     */
    public function show($id)
    {
        $person = Person::with([
            'userAccount.role',
            'userAccount.accountStatus',
            'client',
            'staff',
            'professional.professionalServices.service',
            'identifications',
            'addresses.countryData',
            'addresses.state',
            'addresses.cityData',
            'phones',
        ])->findOrFail($id);

        return response()->json($this->formatPerson($person), 200);
    }

    /**
     * Update the specified person
     */
    public function update(Request $request, $id)
    {
        $person = Person::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'birthdate' => 'sometimes|date',
            'gender' => 'sometimes|string',
            'occupation' => 'sometimes|string',
            'marital_status' => 'sometimes|string',
            'education' => 'sometimes|string',
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $person->update($validated);

        $person->load([
            'userAccount.role',
            'userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Persona actualizada exitosamente',
            'person' => $this->formatPerson($person),
        ], 200);
    }

    /**
     * Remove the specified person
     */
    public function destroy($id)
    {
        $person = Person::findOrFail($id);
        $person->delete();

        return response()->json([
            'message' => 'Persona eliminada exitosamente',
        ], 200);
    }

    /**
     * Format person with cascading data
     */
    private function formatPerson($person)
    {
        return [
            'person_id' => $person->person_id,
            'first_name' => $person->first_name,
            'last_name' => $person->last_name,
            'birthdate' => $person->birthdate,
            'gender' => $person->gender,
            'occupation' => $person->occupation,
            'marital_status' => $person->marital_status,
            'education' => $person->education,
            'email' => $person->userAccount->email,
            'user_account' => [
                'user_id' => $person->userAccount->user_id,                
                'role' => [
                    'role_id' => $person->userAccount->role->role_id,
                    'name' => $person->userAccount->role->name,
                ],
                'status' => [
                    'status_id' => $person->userAccount->accountStatus->status_id,
                    'name' => $person->userAccount->accountStatus->name,
                ],
            ],
            'is_client' => $person->client ? true : false,
            'is_staff' => $person->staff ? true : false,
            'is_professional' => $person->professional ? true : false,
            'professional_info' => $person->professional ? [
                'specialty' => $person->professional->specialty,
                'title' => $person->professional->title,                
            ] : null,
            'identifications' => $person->identifications ? [
                'identification_id' => $person->identifications->identification_id,
                'type' => $person->identifications->type,
                'number' => $person->identifications->number,
                'due_date' => $person->identifications->due_date,
            ] : null,
            'addresses' => $person->addresses ? [
                'address_id' => $person->addresses->address_id,
                'type' => $person->addresses->type,
                'primary_address' => $person->addresses->primary_address,
                'secondary_address' => $person->addresses->secondary_address,
                'country' => [
                    'country_id' => $person->addresses->countryData->country_id,
                    'name' => $person->addresses->countryData->name,
                    'phone_code' => $person->addresses->countryData->phone_code,
                ],
                'state' => [
                    'state_id' => $person->addresses->state->state_id,
                    'name' => $person->addresses->state->name,
                ],
                'city' => [
                    'city_id' => $person->addresses->cityData->city_id,
                    'name' => $person->addresses->cityData->name,
                ],
            ] : null,            
            'phones' => $person->phones ? [
                'phone_id' => $person->phones->phone_id,
                'type' => $person->phones->type,
                'number' => $person->phones->number,
            ] : null,                       
            'created_by' => $person->created_by,
            'creation_date' => $person->creation_date,
            'modified_by' => $person->modified_by,
            'modification_date' => $person->modification_date,
        ];
    }
}