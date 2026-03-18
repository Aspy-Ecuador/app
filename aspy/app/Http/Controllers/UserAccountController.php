<?php
// FINAL
namespace App\Http\Controllers;

use App\Http\Requests\StoreUserAccount;
use App\Models\Client;
use App\Models\Person;
use App\Models\Professional;
use App\Models\Staff;
use App\Models\UserAccount;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserAccountController extends Controller
{
    public function index()
    {        
        $users = UserAccount::with([
            'role',
            'status',
            'person',
        ])->get();

        $users->transform(function ($user) {
            if ($user->person) {
                $person = $user->person;

                $professional = Professional::where('person_id', $person->person_id)->first();
                if ($professional) {
                    $userData['person_type'] = 'professional';
                    $userData['specialty'] = $professional->specialty;
                    $userData['title'] = $professional->title;
                } else {
                    $staff = Staff::where('person_id', $person->person_id)->first();
                    if ($staff) {
                        $userData['person_type'] = 'staff';
                    } else {
                        $client = Client::where('person_id', $person->person_id)->first();
                        if ($client) {
                            $userData['person_type'] = 'client';
                        } else {
                            $userData['person_type'] = 'admin';
                        }
                    }
                }
                return $userData;
            }
            return null;
        });
        return $users;
    }

    public function show($id)
    {
        $user = UserAccount::with([
            'role',
            'status',
            'person',
        ])->find($id);

        if ($user->person) {
            $person = $user->person;

            $professional = Professional::where('person_id', $person->person_id)->first();
            if ($professional) {
                $userData['person_type'] = 'professional';
                $userData['specialty'] = $professional->specialty;
                $userData['title'] = $professional->title;
                $userData['about'] = $professional->about;
            } else {
                $staff = Staff::where('person_id', $person->person_id)->first();
                if ($staff) {
                    $userData['person_type'] = 'staff';
                } else {
                    $client = Client::where('person_id', $person->person_id)->first();
                    if ($client) {
                        $userData['person_type'] = 'client';
                    } else {
                        $userData['person_type'] = 'admin';
                    }
                }
            }
            return response()->json($userData);
        }
        return response()->json(['message' => 'No person data found'], 404);
    }

    public function store(StoreUserAccount $request)
    {
        DB::beginTransaction();

        try {
            // Validación agrupada
            $validated = $request->validate([
            'role_id'       => 'required|integer|exists:role,role_id',
            'status_id'     => 'required|integer|exists:user_account_status,user_account_status_id',
            'email'         => 'required|email|max:150|unique:user_account,email',
            'password_hash' => 'required|string|max:255',
            ]);

            $validated['created_by'] = 1;

            // Crear usuario
            $user = UserAccount::create([
                'role_id' => $validated['role_id'],
                'email' => $validated['email'],
                'password_hash' => Hash::make($validated['password']),
                'status' => 1,
            ]);

            // Crear persona
            $person = Person::create([
                'user_id' => $user->user_id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'birthdate' => $validated['birthdate'],
                'gender_id' => $validated['gender_id'],
                'occupation_id' => $validated['occupation_id'],
                'marital_status_id' => $validated['marital_status_id'],
                'education_id' => $validated['education_id'],
            ]);

            // Crear hijo
            switch ($validated['role_id']) {
                case 2:
                    Professional::create([
                        'person_id' => $person->person_id,
                        'specialty' => $validated['specialty'],
                        'title' => $validated['title'],
                    ]);
                    break;
                case 4:
                    Staff::create(['person_id' => $person->person_id]);
                    break;
                case 3:
                    Client::create(['person_id' => $person->person_id]);
                    break;
            }

            DB::commit();

            return response()->json([
                'user' => $user,
                'person' => $person,
                'person_type' => $validated['person_type'],
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Internal server error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = UserAccount::findOrFail($id);

        $validated = $request->validate([
            'role_id' => 'integer',
            'email' => 'required|email|max:150|unique:user_account,email',
            'status' => 'integer',
        ]);

        $validated['password_hash'] = Hash::make($request->password);
        $validated['modified_by'] = 1;

        $user->update($validated);

        return $user;
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $user = UserAccount::findOrFail($id);

            $person = Person::where('user_id', $user->user_id)->first();

            if ($person) {
                $professional = Professional::where('person_id', $person->person_id)->first();
                if ($professional) {
                    $professional->delete();
                }

                $staff = Staff::where('person_id', $person->person_id)->first();
                if ($staff) {
                    $staff->delete();
                }

                $client = Client::where('person_id', $person->person_id)->first();
                if ($client) {
                    $client->delete();
                }

                $person->delete();
            }

            $user->delete();

            DB::commit();

            return response()->json(['message' => 'Usuario y datos relacionados eliminados correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar usuario: '.$e->getMessage()], 500);
        }
    }
}
