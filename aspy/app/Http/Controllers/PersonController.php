<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Person;
use Illuminate\Http\Request;

class PersonController extends Controller
{
    private const FULL_RELATIONS = [
        'gender',
        'occupation',
        'maritalStatus',
        'education',
        'userAccount.role',
        'phone',
        'address.city.state.country',
        'identification',
        'professional',
        'client',
        'staff',
    ];

    /**
     * Lista de personas según el rol:
     * - Staff/Admin: todas.
     * - Profesional: él mismo y los pacientes que tienen citas con él.
     * - Cliente: su propia ficha y solo los datos públicos de los profesionales (para agendar).
     */
    public function index()
    {
        if ($this->isStaffOrAdmin()) {
            return response()->json(Person::with(self::FULL_RELATIONS)->get());
        }

        $me = $this->currentPersonId();

        if ($this->isProfessional()) {
            $patientIds = Appointment::where('professional_id', $me)->pluck('client_id');

            return response()->json(
                Person::with(self::FULL_RELATIONS)
                    ->where('person_id', $me)
                    ->orWhereIn('person_id', $patientIds)
                    ->get()
            );
        }

        $self = Person::with(self::FULL_RELATIONS)->where('person_id', $me)->get();

        $professionals = Person::with(['userAccount.role', 'professional'])
            ->whereHas('professional')
            ->where('person_id', '!=', $me)
            ->get()
            ->map(fn (Person $p) => [
                'person_id' => $p->person_id,
                'user_id' => $p->user_id,
                'first_name' => $p->first_name,
                'last_name' => $p->last_name,
                'professional' => $p->professional,
                'user_account' => [
                    'role' => $p->userAccount?->role,
                    'is_available' => (bool) $p->userAccount?->is_available,
                ],
            ]);

        return response()->json($self->toBase()->concat($professionals)->values());
    }

    /** Puede ver una ficha: staff/admin, la propia persona o el profesional que la atiende. */
    private function canView(Person $person): bool
    {
        if ($this->isStaffOrAdmin() || (int) $person->person_id === $this->currentPersonId()) {
            return true;
        }

        return $this->isProfessional()
            && Appointment::where('professional_id', $this->currentPersonId())
                ->where('client_id', $person->person_id)
                ->exists();
    }

    public function show(int $id)
    {
        $person = Person::with([
            'gender',
            'occupation',
            'maritalStatus',
            'education',
            'userAccount',
            'phone',
            'address',
            'identification',
        ])->find($id);
 
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }

        if (! $this->canView($person)) {
            return $this->forbidden();
        }
 
        return response()->json($person);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'           => 'nullable|integer|exists:user_account,user_account_id',
            'gender_id'         => 'nullable|integer|exists:gender,gender_id',
            'occupation_id'     => 'nullable|integer|exists:occupation,occupation_id',
            'marital_status_id' => 'nullable|integer|exists:marital_status,marital_status_id',
            'education_id'      => 'nullable|integer|exists:education,education_id',
            'first_name'        => 'required|string|max:100',
            'last_name'         => 'required|string|max:100',
            'birthdate'         => 'nullable|date',
            'created_by'        => 'nullable|integer',
        ]);
 
        $validated['created_by'] = auth()->id();

        $person = Person::create($validated);
 
        return response()->json($person->load([
            'gender',
            'occupation',
            'maritalStatus',
            'education',
            'userAccount',
        ]), 201);
    }

    public function update(Request $request, $id)
    {
        $person = Person::find($id);
 
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }

        $isSelf = (int) $person->person_id === $this->currentPersonId();
        if (! $isSelf && ! $this->isStaffOrAdmin()) {
            return $this->forbidden();
        }
 
        $validated = $request->validate([
            'gender_id'         => 'nullable|integer|exists:gender,gender_id',
            'occupation_id'     => 'nullable|integer|exists:occupation,occupation_id',
            'marital_status_id' => 'nullable|integer|exists:marital_status,marital_status_id',
            'education_id'      => 'nullable|integer|exists:education,education_id',
            'first_name'        => 'sometimes|required|string|max:100',
            'last_name'         => 'sometimes|required|string|max:100',
            'birthdate'         => 'nullable|date',
            'modified_by'       => 'nullable|integer',
        ]);
 
        $validated['modified_by'] = auth()->id();

        $person->update($validated);
 
        return response()->json($person->load([
            'gender',
            'occupation',
            'maritalStatus',
            'education',
            'userAccount',
        ]));
    }

    public function destroy($id)
    {
        $person = Person::find($id);
 
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }
 
        $person->delete();
 
        return response()->json(['message' => 'Person deleted successfully']);
    }

    public function changeAvailable($id, Request $request)
    {
        $person = Person::find($id);

        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }

        if (! $person->userAccount) {
            return response()->json(['message' => 'La persona no tiene cuenta de usuario'], 404);
        }
        if ($person->userAccount->role_id === self::ROLE_ADMIN && ! $this->isAdmin()) {
            return $this->forbidden();
        }

        $person->userAccount->is_available = $request->boolean('is_available');
        $person->userAccount->save();

        return response()->json(['message' => 'User availability updated', 'user_account' => $person->userAccount]);
    }    
}