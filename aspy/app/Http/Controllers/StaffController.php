<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    /**
     * Display a listing of staff
     */
    public function index()
    {
        $staff = Staff::with([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
        ])->get();

        return response()->json($staff->map(function ($staffMember) {
            return $this->formatStaff($staffMember);
        }), 200);
    }

    /**
     * Store a newly created staff member
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|exists:person,person_id|unique:staff,person_id',
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $staffMember = Staff::create($validated);

        $staffMember->load([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Staff creado exitosamente',
            'staff' => $this->formatStaff($staffMember),
        ], 201);
    }

    /**
     * Display the specified staff member
     */
    public function show($id)
    {
        $staffMember = Staff::with([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
            'person.workerSchedules.schedule',
            'person.workerSchedules.appointment',
        ])->findOrFail($id);

        return response()->json($this->formatStaff($staffMember), 200);
    }

    /**
     * Update the specified staff member
     */
    public function update(Request $request, $id)
    {
        $staffMember = Staff::findOrFail($id);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $staffMember->update($validated);

        $staffMember->load([
            'person.userAccount.role',
            'person.userAccount.accountStatus',
        ]);

        return response()->json([
            'message' => 'Staff actualizado exitosamente',
            'staff' => $this->formatStaff($staffMember),
        ], 200);
    }

    /**
     * Remove the specified staff member
     */
    public function destroy($id)
    {
        $staffMember = Staff::findOrFail($id);
        $staffMember->delete();

        return response()->json([
            'message' => 'Staff eliminado exitosamente',
        ], 200);
    }

    /**
     * Format staff with cascading data
     */
    private function formatStaff($staff)
    {
        return [
            'person_id' => $staff->person_id,
            'person' => [
                'person_id' => $staff->person->person_id,
                'first_name' => $staff->person->first_name,
                'last_name' => $staff->person->last_name,
                'birthdate' => $staff->person->birthdate,
                'gender' => $staff->person->gender,
                'occupation' => $staff->person->occupation,
                'marital_status' => $staff->person->marital_status,
                'education' => $staff->person->education,
                'user_account' => [
                    'user_id' => $staff->person->userAccount->user_id,
                    'email' => $staff->person->userAccount->email,
                    'role' => [
                        'role_id' => $staff->person->userAccount->role->role_id,
                        'name' => $staff->person->userAccount->role->name,
                    ],
                    'status' => [
                        'status_id' => $staff->person->userAccount->accountStatus->status_id,
                        'name' => $staff->person->userAccount->accountStatus->name,
                    ],
                ],
                'identifications' => $staff->person->identifications ? 
                    $staff->person->identifications->map(function ($identification) {
                        return [
                            'identification_id' => $identification->identification_id,
                            'type' => $identification->type,
                            'number' => $identification->number,
                            'due_date' => $identification->due_date,
                        ];
                    })->toArray() : [],
                'addresses' => $staff->person->addresses ? 
                    $staff->person->addresses->map(function ($address) {
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
                'phones' => $staff->person->phones ? 
                    $staff->person->phones->map(function ($phone) {
                        return [
                            'phone_id' => $phone->phone_id,
                            'type' => $phone->type,
                            'number' => $phone->number,
                        ];
                    })->toArray() : [],
                'worker_schedules' => $staff->person->workerSchedules ?? null ? 
                    $staff->person->workerSchedules->map(function ($ws) {
                        return [
                            'worker_schedule_id' => $ws->worker_schedule_id,
                            'is_available' => $ws->is_available,
                            'schedule' => [
                                'schedule_id' => $ws->schedule->schedule_id,
                                'name' => $ws->schedule->name,
                                'date' => $ws->schedule->date,
                                'start_time' => $ws->schedule->start_time,
                                'end_time' => $ws->schedule->end_time,
                            ],
                            'has_appointment' => $ws->appointment ? true : false,
                        ];
                    })->toArray() : [],
            ],
            'created_by' => $staff->created_by,
            'creation_date' => $staff->creation_date,
            'modified_by' => $staff->modified_by,
            'modification_date' => $staff->modification_date,
        ];
    }
}