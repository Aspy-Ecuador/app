<?php

namespace App\Http\Controllers;

use App\Models\WorkerSchedule;
use Illuminate\Http\Request;

class WorkerScheduleController extends Controller
{
    /**
     * Display a listing of worker schedules
     */
    public function index()
    {
        $workerSchedules = WorkerSchedule::with([
            'schedule',
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.professional',
            'person.staff',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
            'appointment.appointmentStatus',
            'appointment.payment.client.person',
            'appointment.payment.service',
        ])->get();

        return response()->json($workerSchedules->map(function ($ws) {
            return $this->formatWorkerSchedule($ws);
        }), 200);
    }

    /**
     * Store a newly created worker schedule
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'schedule_id' => 'required|exists:schedule,schedule_id',
            'person_id' => 'required|exists:person,person_id',
            'is_available' => 'required|boolean',
        ]);

        // Check if combination already exists
        $exists = WorkerSchedule::where('schedule_id', $validated['schedule_id'])
            ->where('person_id', $validated['person_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Este trabajador ya tiene asignado este horario',
            ], 422);
        }

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $workerSchedule = WorkerSchedule::create($validated);

        $workerSchedule->load([
            'schedule',
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.professional',
        ]);

        return response()->json([
            'message' => 'Horario de trabajador creado exitosamente',
            'worker_schedule' => $this->formatWorkerSchedule($workerSchedule),
        ], 201);
    }

    /**
     * Display the specified worker schedule
     */
    public function show($id)
    {
        $workerSchedule = WorkerSchedule::with([
            'schedule',
            'person.userAccount.role',
            'person.userAccount.accountStatus',
            'person.professional.professionalServices.service',
            'person.staff',
            'person.identifications',
            'person.addresses.countryData',
            'person.addresses.state',
            'person.addresses.cityData',
            'person.phones',
            'appointment.appointmentStatus',
            'appointment.payment.client.person',
            'appointment.payment.service',
            'appointment.payment.paymentStatus',
        ])->findOrFail($id);

        return response()->json($this->formatWorkerSchedule($workerSchedule), 200);
    }

    /**
     * Update the specified worker schedule
     */
    public function update(Request $request, $id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);

        $validated = $request->validate([
            'is_available' => 'sometimes|boolean',
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $workerSchedule->update($validated);

        $workerSchedule->load([
            'schedule',
            'person.userAccount.role',
            'person.professional',
        ]);

        return response()->json([
            'message' => 'Horario de trabajador actualizado exitosamente',
            'worker_schedule' => $this->formatWorkerSchedule($workerSchedule),
        ], 200);
    }

    /**
     * Remove the specified worker schedule
     */
    public function destroy($id)
    {
        $workerSchedule = WorkerSchedule::findOrFail($id);
        $workerSchedule->delete();

        return response()->json([
            'message' => 'Horario de trabajador eliminado exitosamente',
        ], 200);
    }

    /**
     * Format worker schedule with cascading data
     */
    private function formatWorkerSchedule($ws)
    {
        return [
            'worker_schedule_id' => $ws->worker_schedule_id,
            'is_available' => $ws->is_available,
            'schedule' => [
                'schedule_id' => $ws->schedule->schedule_id,
                'name' => $ws->schedule->name,
                'date' => $ws->schedule->date,
                'start_time' => $ws->schedule->start_time,
                'end_time' => $ws->schedule->end_time,
                'created_by' => $ws->schedule->created_by,
                'creation_date' => $ws->schedule->creation_date,
            ],
            'person' => [
                'person_id' => $ws->person->person_id,
                'first_name' => $ws->person->first_name,
                'last_name' => $ws->person->last_name,
                'birthdate' => $ws->person->birthdate,
                'gender' => $ws->person->gender,
                'occupation' => $ws->person->occupation,
                'marital_status' => $ws->person->marital_status,
                'education' => $ws->person->education,
                'user_account' => [
                    'user_id' => $ws->person->userAccount->user_id,
                    'email' => $ws->person->userAccount->email,
                    'role' => [
                        'role_id' => $ws->person->userAccount->role->role_id,
                        'name' => $ws->person->userAccount->role->name,
                    ],
                    'status' => [
                        'status_id' => $ws->person->userAccount->accountStatus->status_id,
                        'name' => $ws->person->userAccount->accountStatus->name,
                    ],
                ],
                'is_professional' => $ws->person->professional ? true : false,
                'is_staff' => $ws->person->staff ? true : false,
                'professional_info' => $ws->person->professional ? [
                    'specialty' => $ws->person->professional->specialty,
                    'title' => $ws->person->professional->title,
                    'about' => $ws->person->professional->about,
                ] : null,
                'identification' => $ws->person->identifications ? [
                    'identification_id' => $ws->person->identifications->identification_id,
                    'type' => $ws->person->identifications->type,
                    'number' => $ws->person->identifications->number,
                    'due_date' => $ws->person->identifications->due_date,
                ] : null,
                'address' => $ws->person->addresses ? [
                    'address_id' => $ws->person->addresses->address_id,
                    'type' => $ws->person->addresses->type,
                    'primary_address' => $ws->person->addresses->primary_address,
                    'secondary_address' => $ws->person->addresses->secondary_address,
                    'country' => [
                        'country_id' => $ws->person->addresses->countryData->country_id,
                        'name' => $ws->person->addresses->countryData->name,
                        'phone_code' => $ws->person->addresses->countryData->phone_code,
                    ],
                    'state' => [
                        'state_id' => $ws->person->addresses->state->state_id,
                        'name' => $ws->person->addresses->state->name,
                    ],
                    'city' => [
                        'city_id' => $ws->person->addresses->cityData->city_id,
                        'name' => $ws->person->addresses->cityData->name,
                    ],
                ] : null,
                'phone' => $ws->person->phones ? [
                    'phone_id' => $ws->person->phones->phone_id,
                    'type' => $ws->person->phones->type,
                    'number' => $ws->person->phones->number,
                ] : null,
            ],
            'appointment' => $ws->appointment ? [
                'appointment_id' => $ws->appointment->appointment_id,
                'status' => [
                    'status_id' => $ws->appointment->appointmentStatus->status_id,
                    'name' => $ws->appointment->appointmentStatus->name,
                ],
                'client' => $ws->appointment->payment->client ?? null ? [
                    'person_id' => $ws->appointment->payment->client->person->person_id,
                    'first_name' => $ws->appointment->payment->client->person->first_name,
                    'last_name' => $ws->appointment->payment->client->person->last_name,
                ] : null,
                'service' => $ws->appointment->payment->service ?? null ? [
                    'service_id' => $ws->appointment->payment->service->service_id,
                    'name' => $ws->appointment->payment->service->name,
                ] : null,
                'payment_status' => $ws->appointment->payment->paymentStatus ?? null ? [
                    'status_id' => $ws->appointment->payment->paymentStatus->status_id,
                    'name' => $ws->appointment->payment->paymentStatus->name,
                ] : null,
            ] : null,
            'created_by' => $ws->created_by,
            'creation_date' => $ws->creation_date,
            'modified_by' => $ws->modified_by,
            'modification_date' => $ws->modification_date,
        ];
    }
}