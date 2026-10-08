<?php

namespace App\Http\Controllers;

use App\Models\UserConsent;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Consentimiento para tratar datos personales (Ley Orgánica de Protección de Datos Personales).
 *
 * - Lo da la propia persona: al registrarse o, si la fundación le creó la cuenta, en su primer
 *   ingreso (la web no la deja continuar hasta entonces). Aplica a todos los roles.
 * - Es explícito y por separado (arts. 8 y 26): cada declaración se acepta una por una y queda
 *   guardado cuáles se aceptaron, cuándo y desde dónde.
 * - En menores de 15 años lo da su madre, padre o representante legal (art. 21), y queda su nombre
 *   y su identificación.
 * - Se puede retirar en cualquier momento, tan fácil como se dio (art. 8).
 *
 * Siempre actúa sobre la cuenta de la sesión: no recibe ningún id, así que nadie puede aceptar ni
 * retirar por otra persona.
 */
class ConsentimientoController extends Controller
{
    /** Versión vigente de la política. Si cambia el texto, súbela: todos deberán aceptarla de nuevo. */
    public const VERSION = '2.0';

    /** Edad desde la que una persona puede consentir por sí misma (art. 21). */
    public const EDAD_PARA_CONSENTIR = 15;

    /**
     * Declaraciones que debe aceptar cada quien (las mismas claves que `config/politica.ts` en la web):
     * - tratamiento: sus datos personales, para las finalidades de la política;
     * - datos_sensibles: datos de salud y discapacidad (pacientes y familias);
     * - confidencialidad: deber de reserva de quien trabaja con datos ajenos (personal de la fundación);
     * - transferencia: que los datos se guarden en servidores fuera del Ecuador.
     */
    public static function declaracionesRequeridas(int $roleId): array
    {
        return $roleId === self::ROLE_CLIENT
            ? ['tratamiento', 'datos_sensibles', 'transferencia']
            : ['tratamiento', 'confidencialidad', 'transferencia'];
    }

    /**
     * Quién da el consentimiento según la edad de la persona dueña de la cuenta (solo pacientes):
     * "obligatorio" = menor de 15 años, lo da su representante legal; "opcional" = de 15 a 17, puede
     * darlo por sí misma o su representante; "no" = persona adulta (o personal de la fundación).
     */
    public static function modoRepresentante(int $roleId, $fechaNacimiento): string
    {
        if ($roleId !== self::ROLE_CLIENT || ! $fechaNacimiento) {
            return 'no';
        }
        try {
            $edad = Carbon::parse($fechaNacimiento)->age;
        } catch (\Throwable) {
            return 'no';
        }

        return $edad < self::EDAD_PARA_CONSENTIR ? 'obligatorio' : ($edad < 18 ? 'opcional' : 'no');
    }

    public static function requiereRepresentante(int $roleId, $fechaNacimiento): bool
    {
        return self::modoRepresentante($roleId, $fechaNacimiento) === 'obligatorio';
    }

    /** Reglas de validación del consentimiento (las usa también el registro público). */
    public static function reglas(int $roleId, $fechaNacimiento): array
    {
        $requeridas = self::declaracionesRequeridas($roleId);
        $representante = self::requiereRepresentante($roleId, $fechaNacimiento);

        return [
            'accepted_privacy_policy' => 'required|accepted',
            'policy_version' => 'required|string|in:'.self::VERSION,
            'consentimiento' => 'required|array',
            'consentimiento.declaraciones' => ['required', 'array', function ($atributo, $valor, $fallar) use ($requeridas) {
                if (array_diff($requeridas, is_array($valor) ? $valor : []) !== []) {
                    $fallar('Falta aceptar una o más declaraciones del consentimiento.');
                }
            }],
            'consentimiento.representante.nombre' => [$representante ? 'required' : 'nullable', 'string', 'min:5', 'max:150'],
            'consentimiento.representante.identificacion' => [$representante ? 'required' : 'nullable', 'string', 'regex:/^[A-Za-z0-9]{5,20}$/'],
        ];
    }

    /** Lo que queda guardado como constancia. */
    public static function constancia(Request $request, int $roleId): array
    {
        $nombre = trim((string) $request->input('consentimiento.representante.nombre'));
        $identificacion = trim((string) $request->input('consentimiento.representante.identificacion'));
        $porRepresentante = $nombre !== '' && $identificacion !== '';

        return [
            'policy_version' => self::VERSION,
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 255),
            'accepted_at' => now(),
            // Solo las declaraciones que le corresponden a su rol, en un orden fijo
            'declaraciones' => array_values(array_intersect(
                self::declaracionesRequeridas($roleId),
                (array) $request->input('consentimiento.declaraciones', [])
            )),
            'calidad' => $porRepresentante ? 'representante' : 'titular',
            'representante_nombre' => $porRepresentante ? $nombre : null,
            'representante_identificacion' => $porRepresentante ? $identificacion : null,
        ];
    }

    public function show(Request $request): JsonResponse
    {
        $cuenta = $request->user();
        $vigente = $this->vigente($request);

        return response()->json([
            'pendiente' => $vigente === null,
            'version' => self::VERSION,
            'declaraciones' => self::declaracionesRequeridas((int) $cuenta->role_id),
            'representante' => self::modoRepresentante((int) $cuenta->role_id, $cuenta->person?->birthdate),
            'aceptado_el' => $vigente?->accepted_at,
            'calidad' => $vigente?->calidad,
            // El retiro en línea es para pacientes y familias; el personal lo tramita con la fundación
            'puede_retirar' => $vigente !== null && $this->isClient(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $cuenta = $request->user();
        $request->validate(self::reglas((int) $cuenta->role_id, $cuenta->person?->birthdate));

        if ($this->vigente($request) === null) {
            UserConsent::create(['user_id' => $cuenta->user_account_id] + self::constancia($request, (int) $cuenta->role_id));
        }

        return response()->json(['pendiente' => false, 'version' => self::VERSION], 201);
    }

    /**
     * Retirar el consentimiento: queda la fecha, la cuenta se deshabilita y se cierran sus sesiones.
     * La fundación ve el aviso en la lista de usuarios y decide qué datos debe eliminar.
     */
    public function retirar(Request $request): JsonResponse
    {
        if (! $this->isClient()) {
            return $this->forbidden('Para retirar tu consentimiento, comunícate con la administración de la fundación.');
        }

        $request->validate(['confirmar' => 'required|accepted']);

        $cuenta = $request->user();

        try {
            DB::transaction(function () use ($cuenta) {
                UserConsent::where('user_id', $cuenta->user_account_id)->whereNull('revoked_at')->update(['revoked_at' => now()]);
                $cuenta->is_available = false;
                $cuenta->save();
                $cuenta->tokens()->delete();
            });
        } catch (\Throwable $e) {
            return $this->serverError('No se pudo registrar el retiro del consentimiento.', $e);
        }

        return response()->json(['retirado' => true]);
    }

    /** Consentimiento vigente de la cuenta: de la versión actual y sin retirar. */
    private function vigente(Request $request): ?UserConsent
    {
        return UserConsent::where('user_id', $request->user()->user_account_id)
            ->where('policy_version', self::VERSION)
            ->whereNull('revoked_at')
            ->latest('accepted_at')
            ->first();
    }
}
