<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use App\Models\Person;
use App\Models\Professional;
use App\Models\Staff;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class UserAccountController extends Controller
{
    public function index()
    {
        $users = UserAccount::with('person')->get();

        $users->transform(function ($user) {
            if ($user->person) {
                $person = $user->person;

                $userData = [
                    'user_id'        => $user->user_id,
                    'role_id'        => $user->role_id,
                    'email'          => $user->email,
                    'status'         => $user->status,
                    'person_id'      => $person->person_id,
                    'first_name'     => $person->first_name,
                    'last_name'      => $person->last_name,
                    'birthdate'      => $person->birthdate,
                    'gender'         => $person->gender,
                    'occupation'     => $person->occupation,
                    'marital_status' => $person->marital_status,
                    'education'      => $person->education,
                ];

                $userData['role'] = match ($user->role_id) {
                    1 => 'Administrador',
                    2 => 'Profesional',
                    3 => 'Paciente',
                    4 => 'Secretario'
                };

                $professional = Professional::where('person_id', $person->person_id)->first();
                if ($professional) {
                    $userData['person_type'] = 'professional';
                    $userData['specialty']   = $professional->specialty;
                    $userData['title']       = $professional->title;
                    $userData['about']       = $professional->about;
                } else {
                    $staff = Staff::where('person_id', $person->person_id)->first();
                    if ($staff) {
                        $userData['person_type'] = 'staff';
                    } else {
                        $client = Client::where('person_id', $person->person_id)->first();
                        if ($client) {
                            $userData['person_type'] = 'client';
                        }
                    }
                }

                return $userData;
            }

            return null;
        });

        return $users->filter()->values();
    }


    public function show($id)
    {
        $user = UserAccount::with('person')->findOrFail($id);

        if ($user->person) {
            $person = $user->person;

            $userData = [
                'user_id'        => $user->user_id,
                'role_id'        => $user->role_id,
                'email'          => $user->email,
                'status'         => $user->status,
                'person_id'      => $person->person_id,
                'first_name'     => $person->first_name,
                'last_name'      => $person->last_name,
                'birthdate'      => $person->birthdate,
                'gender'         => $person->gender,
                'occupation'     => $person->occupation,
                'marital_status' => $person->marital_status,
                'education'      => $person->education,
            ];

            $userData['role'] = match ($user->role_id) {
                1 => 'Administrador',
                2 => 'Profesional',
                3 => 'Paciente',
                4 => 'Secretario'
            };

            $professional = Professional::where('person_id', $person->person_id)->first();
            if ($professional) {
                $userData['person_type'] = 'professional';
                $userData['specialty']   = $professional->specialty;
                $userData['title']       = $professional->title;
                $userData['about']       = $professional->about;
            } else {
                $staff = Staff::where('person_id', $person->person_id)->first();
                if ($staff) {
                    $userData['person_type'] = 'staff';
                } else {
                    $client = Client::where('person_id', $person->person_id)->first();
                    if ($client) {
                        $userData['person_type'] = 'client';
                    }
                }
            }

            return response()->json($userData);
        }

        return response()->json(['message' => 'No person data found'], 404);
    }

    

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validación agrupada
            $validated = $request->validate([
                // UserAccount
                'role_id' => 'required|integer',
                'email' => 'required|email|unique:user_account,email',
                'password' => 'required|string',

                // Person
                'first_name' => 'required|string',
                'last_name' => 'nullable|string',
                'birthdate' => 'required|date|before_or_equal:today',
                'gender' => 'required|integer',
                'occupation' => 'required|integer',
                'marital_status' => 'required|integer',
                'education' => 'required|integer',

                // person_type
                'person_type' => 'required|string|in:professional,staff,client',

                // Professional (solo si aplica)
                'specialty' => 'required_if:person_type,professional|string|nullable',
                'title' => 'required_if:person_type,professional|string|nullable',
                'about' => 'nullable|string',
            ]);

            // Crear usuario
            $user = UserAccount::create([
                'role_id' => $validated['role_id'],
                'email' => $validated['email'],
                'password_hash' => Hash::make($validated['password']),
                'status' => 1
            ]);

            // Crear persona
            $person = Person::create([
                'user_id' => $user->user_id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'] ?? null,
                'birthdate' => $validated['birthdate'],
                'gender' => $validated['gender'],
                'occupation' => $validated['occupation'],
                'marital_status' => $validated['marital_status'],
                'education' => $validated['education'],
            ]);

            // Crear hijo
            switch ($validated['person_type']) {
                case 'professional':
                    Professional::create([
                        'person_id' => $person->person_id,
                        'specialty' => $validated['specialty'],
                        'title' => $validated['title'],
                        'about' => $validated['about'] ?? null,
                    ]);
                    break;
                case 'staff':
                    Staff::create(['person_id' => $person->person_id]);
                    break;
                case 'client':
                    Client::create(['person_id' => $person->person_id]);
                    break;
            }

            DB::commit();

            return response()->json([
                'user' => $user,
                'person' => $person,
                'person_type' => $validated['person_type']
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $user = UserAccount::findOrFail($id);
        $validated = $request->validate([
            'role_id' => 'integer',
            'email' => 'email|unique:user_account,email,'.$id,
            'status' => 'integer'
        ]);
        
        $validated['password_hash'] = Hash::make($request->password); 
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
        $person = Person::where('user_id', $user->user_id)->first();

        if ($person) {
            // Borrar el hijo relacionado (professional, staff o client)

            // Intentamos borrar Professional
            $professional = Professional::where('person_id', $person->person_id)->first();
            if ($professional) {
                $professional->delete();
            }

            // Intentamos borrar Staff
            $staff = Staff::where('person_id', $person->person_id)->first();
            if ($staff) {
                $staff->delete();
            }

            // Intentamos borrar Client
            $client = Client::where('person_id', $person->person_id)->first();
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
