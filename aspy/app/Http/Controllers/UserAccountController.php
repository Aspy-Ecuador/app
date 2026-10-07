<?php

// FINAL

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserAccount;
use App\Models\Client;
use App\Models\Person;
use App\Models\Professional;
use App\Models\Staff;
use App\Models\UserAccount;
use App\Models\UserConsent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class UserAccountController extends Controller
{
    /** Subtipo (client/professional/staff) que corresponde a cada role_id. */
    private static function subtypeForRole(int $roleId): ?string
    {
        return match ($roleId) {
            self::ROLE_CLIENT => 'client',
            self::ROLE_PROFESSIONAL => 'professional',
            self::ROLE_STAFF => 'staff',
            default => null,
        };
    }

    /** Ocupación "Otra": se escribe en occupation_other. */
    private const OCUPACION_OTRA = 10;

    /**
     * Reglas comunes de alta y edición para teléfono, identificación y ocupación "Otra":
     * - Teléfono: solo números (se admite + y espacios), entre 7 y 20 caracteres.
     * - Cédula: 10 números · RUC: 13 números · Pasaporte: letras y números (5 a 20).
     */
    private function reglasContacto(Request $request): array
    {
        return [
            'phone.number' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9 ]{7,20}$/'],
            'identification.type' => 'required|string|in:cedula,ruc,pasaporte',
            'identification.number' => [
                'required', 'string', 'max:50',
                function (string $attribute, mixed $value, \Closure $fail) use ($request) {
                    $tipo = $request->input('identification.type');
                    $ok = match ($tipo) {
                        'cedula' => (bool) preg_match('/^[0-9]{10}$/', (string) $value),
                        'ruc' => (bool) preg_match('/^[0-9]{13}$/', (string) $value),
                        default => (bool) preg_match('/^[A-Za-z0-9]{5,20}$/', (string) $value),
                    };
                    if (! $ok) {
                        $fail(match ($tipo) {
                            'cedula' => 'La cédula debe tener 10 números.',
                            'ruc' => 'El RUC debe tener 13 números.',
                            default => 'El pasaporte solo puede tener letras y números (5 a 20).',
                        });
                    }
                },
            ],
            'occupation_other' => 'nullable|string|max:80|required_if:occupation_id,'.self::OCUPACION_OTRA,
        ];
    }

    /** Texto de la ocupación "Otra" (null si eligió una ocupación de la lista). */
    private static function ocupacionOtra(array $validated): ?string
    {
        return (int) $validated['occupation_id'] === self::OCUPACION_OTRA
            ? trim((string) ($validated['occupation_other'] ?? '')) ?: null
            : null;
    }

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
        if (! $this->isStaffOrAdmin() && (int) $id !== auth()->id()) {
            return $this->forbidden();
        }

        $user = UserAccount::with([
            'role',
            'status',
            'person',
        ])->find($id);

        if (! $user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

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

    public function store(Request $request): JsonResponse
    {
        // La política de privacidad la acepta la propia persona al registrarse (registro público).
        // En el alta desde el panel (staff/admin, con sesión) no se pide: nadie la acepta por otro.
        $registroPublico = ! auth()->check();

        $validated = $request->validate(array_merge([
            // ── UserAccount ───────────────────────────────────
            'email'                     => 'required|email|max:150|unique:user_account,email',
            'password'                  => 'required|string|min:8|confirmed', // espera password_confirmation
            'role_id'                   => 'required|integer|exists:role,role_id',
            'accepted_privacy_policy'   => $registroPublico ? 'required|accepted' : 'nullable',
            'policy_version'            => $registroPublico ? 'required|string|max:10' : 'nullable|string|max:10',

            // ── Datos base de Person ──────────────────────────
            'gender_id'                 => 'required|integer|exists:gender,gender_id',
            'occupation_id'             => 'required|integer|exists:occupation,occupation_id',
            'marital_status_id'         => 'required|integer|exists:marital_status,marital_status_id',
            'education_id'              => 'required|integer|exists:education,education_id',
            'first_name'                => 'required|string|max:100',
            'last_name'                 => 'required|string|max:100',
            'birthdate'                 => 'required|date',

            // ── Phone ─────────────────────────────────────────
            'phone.number'              => 'required|string|max:30',
            'phone.type'                => 'required|string|max:50',

            // ── Address ───────────────────────────────────────
            'address.type'              => 'required|string|max:50',
            'address.country_id'        => 'required|integer|exists:country,country_id',
            'address.state_id'          => 'required|integer|exists:state,state_id',
            'address.city_id'           => 'required|integer|exists:city,city_id',
            'address.primary_address'   => 'required|string|max:255',
            'address.secondary_address' => 'required|string|max:255',

            // ── Identification ────────────────────────────────
            'identification.type'       => 'required|string|max:50',
            'identification.number'     => 'required|string|max:50',

            // ── Subtipo (opcional) ────────────────────────────
            'role'                      => 'nullable|string|in:client,professional,staff',
            'specialty'                 => 'nullable|string|max:150|required_if:role,professional',
            'title'                     => 'nullable|string|max:150',
        ], $this->reglasContacto($request)));

        // El rol lo decide el servidor, nunca el formulario:
        // - Registro público (/registro, sin sesión): siempre Cliente.
        // - Alta por staff (/crear): cualquier rol excepto Admin; solo un Admin crea Admins.
        if ($registroPublico) {
            $validated['role_id'] = self::ROLE_CLIENT;
        } elseif ((int) $validated['role_id'] === self::ROLE_ADMIN && ! $this->isAdmin()) {
            return $this->forbidden('Solo un administrador puede crear administradores.');
        }
        $validated['role'] = self::subtypeForRole((int) $validated['role_id']);

        $createdBy = auth()->id() ?? 0;

        $person = DB::transaction(function () use ($validated, $createdBy, $request, $registroPublico) {

            // 1. Crear UserAccount (contraseña encriptada)
            $userAccount = UserAccount::create([
                'role_id'       => $validated['role_id'],
                'status_id'     => 1,
                'email'         => $validated['email'],
                'password_hash' => Hash::make($validated['password']),
                'created_by'    => $createdBy,
                'creation_date' => now()

            ]);

            // Solo queda constancia del consentimiento que dio la propia persona
            if ($registroPublico) {
                UserConsent::create([
                    'user_id'        => $userAccount->user_account_id,
                    'policy_version' => $validated['policy_version'],
                    'ip_address'     => $request->ip(),
                    'accepted_at'    => now(),
                ]);
            }

            // 2. Crear Person vinculada al UserAccount recién creado
            $person = Person::create([
                'user_id'           => $userAccount->user_account_id,
                'gender_id'         => $validated['gender_id'] ?? null,
                'occupation_id'     => $validated['occupation_id'] ?? null,
                'occupation_other'  => self::ocupacionOtra($validated),
                'marital_status_id' => $validated['marital_status_id'] ?? null,
                'education_id'      => $validated['education_id'] ?? null,
                'first_name'        => $validated['first_name'],
                'last_name'         => $validated['last_name'],
                'birthdate'         => $validated['birthdate'] ?? null,
                'created_by'        => $createdBy,
                'creation_date'     => now()
            ]);

            // 3. Crear Phone
            $person->phone()->create([
                'number'     => $validated['phone']['number'],
                'type'       => $validated['phone']['type'] ?? null,
                'created_by' => $createdBy,
                'creation_date' => now()
            ]);

            // 4. Crear Address
            $person->address()->create([
                'type'              => $validated['address']['type'] ?? null,
                'country_id'        => $validated['address']['country_id'] ?? null,
                'state_id'          => $validated['address']['state_id'] ?? null,
                'city_id'           => $validated['address']['city_id'] ?? null,
                'primary_address'   => $validated['address']['primary_address'] ?? null,
                'secondary_address' => $validated['address']['secondary_address'] ?? null,
                'created_by'        => $createdBy,
                'creation_date'     => now()
            ]);

            // 5. Crear Identification
            $person->identification()->create([
                'type'       => $validated['identification']['type'],
                'number'     => $validated['identification']['number'],
                'created_by' => $createdBy,
                'creation_date' => now()
            ]);

            // 6. Crear subtipo si se envía el campo role
            match ($validated['role'] ?? null) {
                'client'       => Client::create([
                                    'person_id'  => $person->person_id,
                                    'created_by' => $createdBy,
                                    'creation_date' => now()
                                  ]),
                'professional' => Professional::create([
                                    'person_id'  => $person->person_id,
                                    'specialty'  => $validated['specialty'] ?? null,
                                    'title'      => $validated['title'] ?? null,
                                    'created_by' => $createdBy,
                                    'creation_date' => now()
                                  ]),
                'staff'        => Staff::create([
                                    'person_id'  => $person->person_id,
                                    'created_by' => $createdBy,
                                    'creation_date' => now()
                                  ]),
                default        => null,
            };

            return $person;
        });

        return response()->json(
            $person->load([
                'userAccount.role',
                'userAccount.status',
                'gender',
                'occupation',
                'maritalStatus',
                'education',
                'phone',
                'address.country',
                'address.state',
                'address.city',
                'identification',
                'client',
                'professional',
                'staff',
            ]),
            201
        );
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(array_merge([
            // ── UserAccount ───────────────────────────────────
            'email' => "required|email|max:150|unique:user_account,email,{$id},user_account_id",
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'required|integer|exists:role,role_id',

            // ── Person ────────────────────────────────────────
            'gender_id' => 'required|integer|exists:gender,gender_id',
            'occupation_id' => 'required|integer|exists:occupation,occupation_id',
            'marital_status_id' => 'required|integer|exists:marital_status,marital_status_id',
            'education_id' => 'required|integer|exists:education,education_id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birthdate' => 'required|date',

            // ── Phone ─────────────────────────────────────────
            'phone.number' => 'required|string|max:30',
            'phone.type' => 'required|string|max:50',

            // ── Address ───────────────────────────────────────
            'address.type' => 'required|string|max:50',
            'address.country_id' => 'required|integer|exists:country,country_id',
            'address.state_id' => 'required|integer|exists:state,state_id',
            'address.city_id' => 'required|integer|exists:city,city_id',
            'address.primary_address' => 'required|string|max:255',
            'address.secondary_address' => 'required|string|max:255',

            // ── Identification ────────────────────────────────
            'identification.type' => 'required|string|max:50',
            'identification.number' => 'required|string|max:50',

            // ── Subtipo ───────────────────────────────────────
            'role' => 'nullable|string|in:client,professional,staff',
            'specialty' => 'nullable|string|max:150|required_if:role,professional',
            'title' => 'nullable|string|max:150',
        ], $this->reglasContacto($request)));

        $updatedBy = auth()->id() ?? 0;

        $target = Person::with('userAccount')->findOrFail($id);
        $isSelf = (int) $target->user_id === (int) auth()->id();

        if (! $isSelf && ! $this->isStaffOrAdmin()) {
            return $this->forbidden();
        }
        if (! $this->isAdmin()) {
            // Solo un Admin puede editar cuentas Admin o asignar el rol Admin
            if ($target->userAccount?->role_id === self::ROLE_ADMIN && ! $isSelf) {
                return $this->forbidden();
            }
            if ((int) $validated['role_id'] === self::ROLE_ADMIN && $target->userAccount?->role_id !== self::ROLE_ADMIN) {
                return $this->forbidden('Solo un administrador puede asignar el rol de administrador.');
            }
        }
        if ($isSelf && ! $this->isStaffOrAdmin()) {
            // Un usuario no puede cambiarse su propio rol
            $validated['role_id'] = $target->userAccount->role_id;
        }
        $validated['role'] = self::subtypeForRole((int) $validated['role_id']);

        $person = DB::transaction(function () use ($validated, $id, $updatedBy) {

            // 1. Buscar person + user
            $person = Person::with(['userAccount', 'phone', 'address', 'identification'])->findOrFail($id);
            $userAccount = $person->userAccount;

            // 2. Update UserAccount
            $userAccount->update([
                'role_id' => $validated['role_id'],
                'email' => $validated['email'],
                'modified_by' => $updatedBy,
            ]);

            if (!empty($validated['password'])) {
                $userAccount->update([
                    'password_hash' => Hash::make($validated['password']),
                ]);
            }

            // 3. Update Person
            $person->update([
                'gender_id' => $validated['gender_id'],
                'occupation_id' => $validated['occupation_id'],
                'occupation_other' => self::ocupacionOtra($validated),
                'marital_status_id' => $validated['marital_status_id'],
                'education_id' => $validated['education_id'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'birthdate' => $validated['birthdate'],
                'modified_by' => $updatedBy,
                'modification_date' => now()
            ]);

            // 4. Update Phone
            $person->phone()->update([
                'number' => $validated['phone']['number'],
                'type' => $validated['phone']['type'],
                'modified_by' => $updatedBy,
                'modification_date' => now()
            ]);

            // 5. Update Address
            $person->address()->update([
                'type' => $validated['address']['type'],
                'country_id' => $validated['address']['country_id'],
                'state_id' => $validated['address']['state_id'],
                'city_id' => $validated['address']['city_id'],
                'primary_address' => $validated['address']['primary_address'],
                'secondary_address' => $validated['address']['secondary_address'],
                'modified_by' => $updatedBy,
                'modification_date' => now()
            ]);

            // 6. Update Identification
            $person->identification()->update([
                'type' => $validated['identification']['type'],
                'number' => $validated['identification']['number'],
                'modified_by' => $updatedBy,
                'modification_date' => now()
            ]);

            // 7. Subtipo
            if (($validated['role'] ?? null) === 'professional') {
                $person->professional()->updateOrCreate(
                    ['person_id' => $person->person_id],
                    [
                        'specialty'         => $validated['specialty'] ?? null,
                        'title'             => $validated['title'] ?? null,
                        'modified_by'       => $updatedBy,
                        'modification_date' => now(),
                    ]
                );
            }

            if (($validated['role'] ?? null) === 'client') {
                $person->client()->updateOrCreate(
                    ['person_id' => $person->person_id],
                    [
                        'modified_by'       => $updatedBy,
                        'modification_date' => now(),
                    ]
                );
            }

            if (($validated['role'] ?? null) === 'staff') {
                $person->staff()->updateOrCreate(
                    ['person_id' => $person->person_id],
                    [
                        'modified_by'       => $updatedBy,
                        'modification_date' => now(),
                    ]
                );
            }
            return $person;
        });

        return response()->json(
            $person->load([
                'userAccount.role',
                'userAccount.status',
                'gender',
                'occupation',
                'maritalStatus',
                'education',
                'phone',
                'address.country',
                'address.state',
                'address.city',
                'identification',
                'client',
                'professional',
                'staff',
            ]),
            200
        );
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $user = UserAccount::findOrFail($id);

            if ($user->role_id === self::ROLE_ADMIN && ! $this->isAdmin()) {
                DB::rollBack();
                return $this->forbidden();
            }

            $person = Person::where('user_id', $user->user_account_id)->first();

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
            return $this->serverError('Error al eliminar usuario.', $e);
        }
    }
}
