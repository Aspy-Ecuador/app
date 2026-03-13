<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of clients
     */
    public function index()
    {
        $clients = Client::with([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
            'payments.service',
            'payments.paymentStatus',
        ])->get();

        return response()->json($clients->map(function ($client) {
            return $this->formatClient($client);
        }), 200);
    }

    /**
     * Store a newly created client
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|exists:person,person_id|unique:client,person_id',
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $client = Client::create($validated);

        $client->load([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Cliente creado exitosamente',
            'client' => $this->formatClient($client),
        ], 201);
    }

    /**
     * Display the specified client
     */
    public function show($id)
    {
        $client = Client::with([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
            'payments.service',
            'payments.paymentStatus',
            'payments.paymentData',
            'payments.appointments.appointmentStatus',
        ])->findOrFail($id);

        return response()->json($this->formatClient($client), 200);
    }

    /**
     * Update the specified client
     */
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $client->update($validated);

        $client->load([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Cliente actualizado exitosamente',
            'client' => $this->formatClient($client),
        ], 200);
    }

    /**
     * Remove the specified client
     */
    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json([
            'message' => 'Cliente eliminado exitosamente',
        ], 200);
    }

    /**
     * Format client with cascading data
     */
    private function formatClient($client)
    {
        return [
            'person_id' => $client->person_id,
            'person' => [
                'person_id' => $client->person->person_id,
                'first_name' => $client->person->first_name,
                'last_name' => $client->person->last_name,
                'birthdate' => $client->person->birthdate,
                'gender' => $client->person->gender,
                'occupation' => $client->person->occupation,
                'marital_status' => $client->person->marital_status,
                'education' => $client->person->education,
                'user_account' => [
                    'user_id' => $client->person->userAccount->user_id,
                    'email' => $client->person->userAccount->email,
                    'role' => [
                        'role_id' => $client->person->userAccount->role->role_id,
                        'name' => $client->person->userAccount->role->name,
                    ],
                    'status' => [
                        'status_id' => $client->person->userAccount->accountStatus->status_id,
                        'name' => $client->person->userAccount->accountStatus->name,
                    ],
                ],
                'identifications' => $client->person->identifications ? 
                    $client->person->identifications->map(function ($identification) {
                        return [
                            'identification_id' => $identification->identification_id,
                            'type' => $identification->type,
                            'number' => $identification->number,
                            'due_date' => $identification->due_date,
                        ];
                    })->toArray() : [],
                'addresses' => $client->person->addresses ? 
                    $client->person->addresses->map(function ($address) {
                        return [
                            'address_id' => $address->address_id,
                            'type' => $address->type,
                            'primary_address' => $address->primary_address,
                            'secondary_address' => $address->secondary_address,
                            'country' => [
                                'country_id' => $address->countryData->country_id,
                                'name' => $address->countryData->name,
                                'phone_code' => $address->countryData->phone_code,
                            ],
                            'state' => [
                                'state_id' => $address->state->state_id,
                                'name' => $address->state->name,
                            ],
                            'city' => [
                                'city_id' => $address->cityData->city_id,
                                'name' => $address->cityData->name,
                            ],
                        ];
                    })->toArray() : [],
                'phones' => $client->person->phones ? 
                    $client->person->phones->map(function ($phone) {
                        return [
                            'phone_id' => $phone->phone_id,
                            'type' => $phone->type,
                            'number' => $phone->number,
                        ];
                    })->toArray() : [],
            ],
            'payments' => $client->payments ? 
                $client->payments->map(function ($payment) {
                    return [
                        'payment_id' => $payment->payment_id,
                        'service_price' => $payment->service_price,
                        'total_amount' => $payment->total_amount,
                        'service' => [
                            'service_id' => $payment->service->service_id,
                            'name' => $payment->service->name,
                            'price' => $payment->service->price,
                        ],
                        'payment_status' => [
                            'status_id' => $payment->paymentStatus->status_id,
                            'name' => $payment->paymentStatus->name,
                        ],
                        'payment_data' => $payment->paymentData ?? null ? [
                            'payment_data_id' => $payment->paymentData->payment_data_id,
                            'type' => $payment->paymentData->type,
                            'number' => $payment->paymentData->number,
                            'file' => $payment->paymentData->file,
                        ] : null,
                        'appointments' => $payment->appointments ?? null ? 
                            $payment->appointments->map(function ($appointment) {
                                return [
                                    'appointment_id' => $appointment->appointment_id,
                                    'status' => [
                                        'status_id' => $appointment->appointmentStatus->status_id,
                                        'name' => $appointment->appointmentStatus->name,
                                    ],
                                ];
                            })->toArray() : [],
                    ];
                })->toArray() : [],
            'created_by' => $client->created_by,
            'creation_date' => $client->creation_date,
            'modified_by' => $client->modified_by,
            'modification_date' => $client->modification_date,
        ];
    }
}