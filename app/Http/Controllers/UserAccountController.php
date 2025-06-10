<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use App\Models\Person;
use App\Models\Professional;
use App\Models\Staff;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserAccountController extends Controller
{
    public function index()
    {
        return UserAccount::all();
    }

    public function show($id)
    {
        return UserAccount::findOrFail($id);
    }

    public function store(Request $request)
{
    $validatedUser = $request->validate([
        'role_id' => 'required|integer',
        'email' => 'required|email|unique:user_accounts,email',
        'password_hash' => 'required|string',
        'status' => 'required|integer',
        
    ]);

    $validatedPerson = $request->validate([
        'first_name' => 'required|string',
        'middle_name' => 'nullable|string',
        'birthdate' => 'required|date|before_or_equal:today',
        'gender' => 'required|integer',
        'occupation' => 'required|integer',
        'marital_status' => 'required|integer',
        'education' => 'required|integer',
        
    ]);

    $validatedChildType = $request->validate([
        'person_type' => 'required|string|in:professional,staff,client',
    ]);

    \DB::beginTransaction();

    try {
        // Crear UserAccount
        $user = UserAccount::create($validatedUser);

        // Crear Persona ligada a user_id
        $validatedPerson['user_id'] = $user->id;
        $person = Person::create($validatedPerson);

        // Crear el "hijo" según person_type
        if ($validatedChildType['person_type'] === 'professional') {
            // Validar campos adicionales solo para professional
            $validatedProfessional = $request->validate([
                'specialty' => 'required|string',
                'title' => 'required|string',
                'about' => 'nullable|string',
                
            ]);
            $validatedProfessional['person_id'] = $person->id;
            Professional::create($validatedProfessional);

        } elseif ($validatedChildType['person_type'] === 'staff') {
            Staff::create(['person_id' => $person->id]);

        } elseif ($validatedChildType['person_type'] === 'client') {
            Client::create(['person_id' => $person->id]);
        }

        \DB::commit();

        return response()->json([
            'user' => $user,
            'person' => $person,
            'person_type' => $validatedChildType['person_type']
        ], 201);

    } catch (\Exception $e) {
        \DB::rollBack();
        return response()->json(['error' => 'Error al crear usuario: ' . $e->getMessage()], 500);
    }
}


    public function update(Request $request, $id)
    {
        $user = UserAccount::findOrFail($id);
        $validated = $request->validate([
            'role_id' => 'integer',
            'email' => 'email|unique:user_accounts,email,'.$id,
            'password_hash' => 'string',
            'status' => 'integer'
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';
        
        $user->update($validated);
        return $user;
    }

    public function destroy($id)
{
    \DB::beginTransaction();

    try {
        $user = UserAccount::findOrFail($id);

        // Buscar persona relacionada
        $person = Person::where('user_id', $user->id)->first();

        if ($person) {
            // Borrar el hijo relacionado (professional, staff o client)

            // Intentamos borrar Professional
            $professional = Professional::where('person_id', $person->id)->first();
            if ($professional) {
                $professional->delete();
            }

            // Intentamos borrar Staff
            $staff = Staff::where('person_id', $person->id)->first();
            if ($staff) {
                $staff->delete();
            }

            // Intentamos borrar Client
            $client = Client::where('person_id', $person->id)->first();
            if ($client) {
                $client->delete();
            }

            // Borrar la persona
            $person->delete();
        }

        // Borrar el usuario
        $user->delete();

        \DB::commit();

        return response()->json(['message' => 'Usuario y datos relacionados eliminados correctamente'], 200);
    } catch (\Exception $e) {
        \DB::rollBack();
        return response()->json(['error' => 'Error al eliminar usuario: ' . $e->getMessage()], 500);
    }
}

}
