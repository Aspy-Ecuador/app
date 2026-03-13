<?php

namespace App\Http\Controllers;

use App\Models\Professional;
use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    /**
     * Display a listing of professionals
     */
    public function index()
    {
        $professionals = Professional::with([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
            'professionalServices.service',
        ])->get();

        return response()->json($professionals->map(function ($professional) {
            return $this->formatProfessional($professional);
        }), 200);
    }

    /**
     * Store a newly created professional
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|exists:person,person_id|unique:professional,person_id',
            'specialty' => 'required|string',
            'title' => 'required|string|max:50',            
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $professional = Professional::create($validated);

        $professional->load([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Profesional creado exitosamente',
            'professional' => $this->formatProfessional($professional),
        ], 201);
    }

    /**
     * Display the specified professional
     */
    public function show($id)
    {
        $professional = Professional::with([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
            'professionalServices.service',
        ])->findOrFail($id);

        return response()->json($this->formatProfessional($professional), 200);
    }

    /**
     * Update the specified professional
     */
    public function update(Request $request, $id)
    {
        $professional = Professional::findOrFail($id);

        $validated = $request->validate([
            'specialty' => 'sometimes|string',
            'title' => 'sometimes|string|max:50',            
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $professional->update($validated);

        $professional->load([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'professionalServices.service',
        ]);

        return response()->json([
            'message' => 'Profesional actualizado exitosamente',
            'professional' => $this->formatProfessional($professional),
        ], 200);
    }

    /**
     * Remove the specified professional
     */
    public function destroy($id)
    {
        $professional = Professional::findOrFail($id);
        $professional->delete();

        return response()->json([
            'message' => 'Profesional eliminado exitosamente',
        ], 200);
    }

    /**
     * Format professional with cascading data
     */
    private function formatProfessional($professional)
    {
        return [
            'person_id' => $professional->person_id,
            'specialty' => $professional->specialty,
            'title' => $professional->title,            
            'person' => [
                'person_id' => $professional->person->person_id,
                'first_name' => $professional->person->first_name,
                'last_name' => $professional->person->last_name,
                'birthdate' => $professional->person->birthdate,
                'gender' => $professional->person->gender,
                'occupation' => $professional->person->occupation,
                'marital_status' => $professional->person->marital_status,
                'education' => $professional->person->education,
                'user_account' => [
                    'user_id' => $professional->person->userAccount->user_id,
                    'email' => $professional->person->userAccount->email,
                    'role' => [
                        'role_id' => $professional->person->userAccount->role->role_id,
                        'name' => $professional->person->userAccount->role->name,
                    ],
                    'status' => [
                        'status_id' => $professional->person->userAccount->accountStatus->status_id,
                        'name' => $professional->person->userAccount->accountStatus->name,
                    ],
                ],
                'identifications' => $professional->person->identifications ? [
                    'identification_id' => $professional->person->identifications->identification_id,
                    'type' => $professional->person->identifications->type,
                    'number' => $professional->person->identifications->number,
                    'due_date' => $professional->person->identifications->due_date,
                ] : null,
                'addresses' => $professional->person->addresses ? [
                    'address_id' => $professional->person->addresses->address_id,
                    'type' => $professional->person->addresses->type,
                    'primary_address' => $professional->person->addresses->primary_address,
                    'secondary_address' => $professional->person->addresses->secondary_address,
                    'country' => [
                        'country_id' => $professional->person->addresses->countryData->country_id,
                        'name' => $professional->person->addresses->countryData->name,
                        'phone_code' => $professional->person->addresses->countryData->phone_code,
                    ],
                    'state' => [
                        'state_id' => $professional->person->addresses->state->state_id,
                        'name' => $professional->person->addresses->state->name,
                    ],
                    'city' => [
                        'city_id' => $professional->person->addresses->cityData->city_id,
                        'name' => $professional->person->addresses->cityData->name,
                    ],
                ] : null,                    
                'phones' => $professional->person->phones ? [
                    'phone_id' => $professional->person->phones->phone_id,
                    'type' => $professional->person->phones->type,
                    'number' => $professional->person->phones->number,
                ] : null,
            ],
            'services' => $professional->professionalServices ? 
                $professional->professionalServices->map(function ($ps) {
                    return [
                        'professional_service_id' => $ps->professional_service_id,
                        'service' => [
                            'service_id' => $ps->service->service_id,
                            'name' => $ps->service->name,
                            'price' => $ps->service->price,
                        ],
                    ];
                })->toArray() : [],
            'created_by' => $professional->created_by,
            'creation_date' => $professional->creation_date,
            'modified_by' => $professional->modified_by,
            'modification_date' => $professional->modification_date,
        ];
    }
}