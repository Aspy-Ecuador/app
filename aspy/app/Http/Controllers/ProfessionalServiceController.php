<?php

namespace App\Http\Controllers;

use App\Models\ProfessionalService;
use Illuminate\Http\Request;

class ProfessionalServiceController extends Controller
{
    /**
     * Display a listing of professional services
     */
    public function index()
    {
        $professionalServices = ProfessionalService::with([
            'service',
            'professional.person.userAccount.role',
            'professional.person.userAccount.accountStatus',
            'professional.person.identifications',
            'professional.person.addresses.countryData',
            'professional.person.addresses.state',
            'professional.person.addresses.cityData',
            'professional.person.phones',
        ])->get();

        return response()->json($professionalServices->map(function ($ps) {
            return $this->formatProfessionalService($ps);
        }), 200);
    }

    /**
     * Store a newly created professional service
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:service,service_id',
            'person_id' => 'required|exists:professional,person_id',
        ]);

        // Check if combination already exists
        $exists = ProfessionalService::where('service_id', $validated['service_id'])
            ->where('person_id', $validated['person_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Este profesional ya tiene asignado este servicio',
            ], 422);
        }

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $professionalService = ProfessionalService::create($validated);

        $professionalService->load([
            'service',
            'professional.person.userAccount.role',
            'professional.person.userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Servicio profesional creado exitosamente',
            'professional_service' => $this->formatProfessionalService($professionalService),
        ], 201);
    }

    /**
     * Display the specified professional service
     */
    public function show($id)
    {
        $professionalService = ProfessionalService::with([
            'service',
            'professional.person.userAccount.role',
            'professional.person.userAccount.accountStatus',
            'professional.person.identifications',
            'professional.person.addresses.countryData',
            'professional.person.addresses.state',
            'professional.person.addresses.cityData',
            'professional.person.phones',
        ])->findOrFail($id);

        return response()->json($this->formatProfessionalService($professionalService), 200);
    }

    /**
     * Update the specified professional service
     */
    public function update(Request $request, $id)
    {
        $professionalService = ProfessionalService::findOrFail($id);

        $validated = $request->validate([
            'service_id' => 'sometimes|exists:service,service_id',
            'person_id' => 'sometimes|exists:professional,person_id',
        ]);

        // Check if new combination already exists
        if (isset($validated['service_id']) || isset($validated['person_id'])) {
            $serviceId = $validated['service_id'] ?? $professionalService->service_id;
            $personId = $validated['person_id'] ?? $professionalService->person_id;

            $exists = ProfessionalService::where('service_id', $serviceId)
                ->where('person_id', $personId)
                ->where('professional_service_id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Esta combinación de profesional y servicio ya existe',
                ], 422);
            }
        }

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $professionalService->update($validated);

        $professionalService->load([
            'service',
            'professional.person.userAccount.role',
            'professional.person.userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Servicio profesional actualizado exitosamente',
            'professional_service' => $this->formatProfessionalService($professionalService),
        ], 200);
    }

    /**
     * Remove the specified professional service
     */
    public function destroy($id)
    {
        $professionalService = ProfessionalService::findOrFail($id);
        $professionalService->delete();

        return response()->json([
            'message' => 'Servicio profesional eliminado exitosamente',
        ], 200);
    }

    /**
     * Get all services offered by a specific professional
     */
    public function getByProfessional($personId)
    {
        $professionalServices = ProfessionalService::with([
            'service',
            'professional.person.userAccount.role',
        ])
        ->where('person_id', $personId)
        ->get();

        return response()->json($professionalServices->map(function ($ps) {
            return $this->formatProfessionalService($ps);
        }), 200);
    }

    /**
     * Get all professionals that offer a specific service
     */
    public function getByService($serviceId)
    {
        $professionalServices = ProfessionalService::with([
            'service',
            'professional.person.userAccount.role',
            'professional.person.userAccount.accountStatus',
            'professional.person.phones',
        ])
        ->where('service_id', $serviceId)
        ->get();

        return response()->json($professionalServices->map(function ($ps) {
            return $this->formatProfessionalService($ps);
        }), 200);
    }

    /**
     * Format professional service with cascading data
     */
    private function formatProfessionalService($ps)
    {
        return [
            'professional_service_id' => $ps->professional_service_id,
            'service' => [
                'service_id' => $ps->service->service_id,
                'name' => $ps->service->name,
                'price' => $ps->service->price,
                'created_by' => $ps->service->created_by,
                'creation_date' => $ps->service->creation_date,
            ],
            'professional' => [
                'person_id' => $ps->professional->person_id,
                'specialty' => $ps->professional->specialty,
                'title' => $ps->professional->title,
                'about' => $ps->professional->about,
                'person' => [
                    'person_id' => $ps->professional->person->person_id,
                    'first_name' => $ps->professional->person->first_name,
                    'last_name' => $ps->professional->person->last_name,
                    'birthdate' => $ps->professional->person->birthdate,
                    'gender' => $ps->professional->person->gender,
                    'occupation' => $ps->professional->person->occupation,
                    'marital_status' => $ps->professional->person->marital_status,
                    'education' => $ps->professional->person->education,
                    'user_account' => [
                        'user_id' => $ps->professional->person->userAccount->user_id,
                        'email' => $ps->professional->person->userAccount->email,
                        'role' => [
                            'role_id' => $ps->professional->person->userAccount->role->role_id,
                            'name' => $ps->professional->person->userAccount->role->name,
                        ],
                        'status' => [
                            'status_id' => $ps->professional->person->userAccount->accountStatus->status_id,
                            'name' => $ps->professional->person->userAccount->accountStatus->name,
                        ],
                    ],
                    'identification' => $ps->professional->person->identifications ? [
                        'identification_id' => $ps->professional->person->identifications->identification_id,
                        'type' => $ps->professional->person->identifications->type,
                        'number' => $ps->professional->person->identifications->number,
                        'due_date' => $ps->professional->person->identifications->due_date,
                    ] : null,
                    'address' => $ps->professional->person->addresses ? [
                        'address_id' => $ps->professional->person->addresses->address_id,
                        'type' => $ps->professional->person->addresses->type,
                        'primary_address' => $ps->professional->person->addresses->primary_address,
                        'secondary_address' => $ps->professional->person->addresses->secondary_address,
                        'country' => [
                            'country_id' => $ps->professional->person->addresses->countryData->country_id,
                            'name' => $ps->professional->person->addresses->countryData->name,
                            'phone_code' => $ps->professional->person->addresses->countryData->phone_code,
                        ],
                        'state' => [
                            'state_id' => $ps->professional->person->addresses->state->state_id,
                            'name' => $ps->professional->person->addresses->state->name,
                        ],
                        'city' => [
                            'city_id' => $ps->professional->person->addresses->cityData->city_id,
                            'name' => $ps->professional->person->addresses->cityData->name,
                        ],
                    ] : null,
                    'phone' => $ps->professional->person->phones ? [
                        'phone_id' => $ps->professional->person->phones->phone_id,
                        'type' => $ps->professional->person->phones->type,
                        'number' => $ps->professional->person->phones->number,
                    ] : null,
                ],
            ],
            'created_by' => $ps->created_by,
            'creation_date' => $ps->creation_date,
            'modified_by' => $ps->modified_by,
            'modification_date' => $ps->modification_date,
        ];
    }
}