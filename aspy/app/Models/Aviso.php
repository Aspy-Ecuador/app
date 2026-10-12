<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Avisos del sistema: lo que una cuenta tiene que saber y pasó mientras no miraba (alguien reservó una
 * cita contigo, tu comprobante fue aprobado o rechazado, aprobaron tu horario…).
 *
 * - Cada aviso es de UNA cuenta y solo ella lo lee (AvisoController).
 * - Nadie recibe un aviso de lo que acaba de hacer.
 * - Un aviso que no se pudo guardar nunca hace fallar la acción que lo originó.
 * - Lo que está "por revisar" (pagos, horarios) no se guarda aquí: AvisoController lo cuenta en el momento.
 */
class Aviso extends Model
{
    public const CITA_RESERVADA = 'cita_reservada';       // al profesional: alguien reservó con él
    public const CITA_REGISTRADA = 'cita_registrada';     // al paciente: la fundación la registró a su nombre
    public const PAGO_APROBADO = 'pago_aprobado';         // al paciente
    public const PAGO_RECHAZADO = 'pago_rechazado';       // al paciente
    public const CITA_CONFIRMADA = 'cita_confirmada';     // al profesional: el pago fue aprobado
    public const CITA_ELIMINADA = 'cita_eliminada';       // al profesional: el pago fue rechazado
    public const CITA_CANCELADA = 'cita_cancelada';
    public const CITA_MODALIDAD = 'cita_modalidad';       // al paciente: su cita cambió de modalidad
    public const CITA_ENLACE = 'cita_enlace';             // al paciente: ya está el enlace de la reunión
    public const HORARIO_APROBADO = 'horario_aprobado';   // al profesional
    public const HORARIO_POR_APROBAR = 'horario_por_aprobar';
    public const HORARIO_CAMBIADO = 'horario_cambiado';   // al profesional: la fundación cambió su horario
    public const REPORTE_LISTO = 'reporte_listo';         // al paciente

    /** Cada cuenta conserva sus avisos más recientes: los anteriores se borran al llegar uno nuevo. */
    public const MAX_POR_CUENTA = 60;

    /** Un aviso leído se borra al mes; uno que nadie leyó, a los tres meses. */
    public const DIAS_LEIDO = 30;

    public const DIAS_SIN_LEER = 90;

    private const CITA_GUARDADA = 1;

    private const CITA_AGENDADA = 2;

    protected $table = 'aviso';

    protected $primaryKey = 'aviso_id';

    public $timestamps = false;

    protected $fillable = ['user_account_id', 'tipo', 'titulo', 'texto', 'enlace', 'cantidad', 'leido_el', 'creado_el'];

    protected $casts = ['leido_el' => 'datetime', 'creado_el' => 'datetime'];

    // ── Guardar ───────────────────────────────────────────────────────────────

    public static function paraCuenta(?int $cuentaId, string $tipo, string $titulo, string $texto, ?string $enlace = null, int $cantidad = 1): void
    {
        if (! $cuentaId || $cuentaId === (int) auth()->id()) {
            return;
        }

        try {
            self::create([
                'user_account_id' => $cuentaId,
                'tipo' => $tipo,
                'titulo' => Str::limit($titulo, 150),
                'texto' => Str::limit($texto, 690),
                'enlace' => $enlace,
                'cantidad' => $cantidad,
                'creado_el' => now(),
            ]);

            $sobran = self::where('user_account_id', $cuentaId)->orderByDesc('aviso_id')
                ->skip(self::MAX_POR_CUENTA)->take(200)->pluck('aviso_id');
            if ($sobran->isNotEmpty()) {
                self::whereIn('aviso_id', $sobran)->delete();
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /** El id de cliente o de profesional es el `person_id`: de ahí sale su cuenta. */
    public static function paraPersona(?int $personId, string $tipo, string $titulo, string $texto, ?string $enlace = null): void
    {
        self::paraCuenta(self::cuentaDe($personId), $tipo, $titulo, $texto, $enlace);
    }

    private static function cuentaDe(?int $personId): ?int
    {
        $cuenta = $personId ? Person::whereKey($personId)->value('user_id') : null;

        return $cuenta === null ? null : (int) $cuenta;
    }

    /** Lo vencido (MantenimientoOportunista). */
    public static function borrarViejos(): void
    {
        self::whereNotNull('leido_el')->where('leido_el', '<', now()->subDays(self::DIAS_LEIDO))->delete();
        self::where('creado_el', '<', now()->subDays(self::DIAS_SIN_LEER))->delete();
    }

    // ── Qué pasó ──────────────────────────────────────────────────────────────

    /**
     * Los datos de una cita que hacen falta para contarla. Se piden ANTES de borrarla (un pago rechazado
     * elimina la cita) y se le pasan a `pagoRechazado`.
     */
    public static function datosDeCita(Appointment $cita): array
    {
        $cita->loadMissing(['client.person', 'professional.person', 'workerSchedule.schedule', 'service']);
        $horario = $cita->workerSchedule;

        return [
            'id' => (int) $cita->appointment_id,
            'estado' => (int) $cita->appointment_status_id,
            'paciente_id' => (int) $cita->client_id,
            'profesional_id' => (int) $cita->professional_id,
            'paciente' => self::nombre($cita->client?->person),
            'profesional' => self::nombre($cita->professional?->person),
            'servicio' => trim((string) ($cita->service?->name ?? '')) ?: 'atención',
            'cuando' => self::cuando($horario),
            'modalidad' => $horario?->esVirtual() ? WorkerSchedule::VIRTUAL : WorkerSchedule::PRESENCIAL,
        ];
    }

    /** Alguien reservó: se entera su profesional y, si la registró la fundación por él, también el paciente. */
    public static function citaReservada(Appointment $cita): void
    {
        self::sinRomper(function () use ($cita) {
            $d = self::datosDeCita($cita);
            self::paraPersona($d['profesional_id'], self::CITA_RESERVADA, 'Nueva cita reservada',
                "{$d['paciente']} reservó una cita de {$d['servicio']} contigo para el {$d['cuando']} ({$d['modalidad']}). Falta que Secretaría revise el pago.",
                "/citas?cita={$d['id']}");
            self::paraPersona($d['paciente_id'], self::CITA_REGISTRADA, 'Se registró una cita a tu nombre',
                "La fundación registró tu cita de {$d['servicio']} con {$d['profesional']} para el {$d['cuando']} ({$d['modalidad']}). Falta revisar el pago.",
                "/dashboard?cita={$d['id']}");
        });
    }

    public static function pagoAprobado(Appointment $cita): void
    {
        self::sinRomper(function () use ($cita) {
            $d = self::datosDeCita($cita);
            self::paraPersona($d['paciente_id'], self::PAGO_APROBADO, 'Tu comprobante fue aprobado',
                "Tu cita de {$d['servicio']} con {$d['profesional']} quedó agendada para el {$d['cuando']} ({$d['modalidad']}). Ya la puedes ver en tu calendario.",
                "/dashboard?cita={$d['id']}");
            self::paraPersona($d['profesional_id'], self::CITA_CONFIRMADA, 'Cita confirmada',
                "La cita de {$d['paciente']} ({$d['servicio']}) quedó agendada para el {$d['cuando']} ({$d['modalidad']}): su pago fue aprobado.",
                "/citas?cita={$d['id']}");
        });
    }

    /** `$d` son los `datosDeCita` tomados antes de eliminar la cita. */
    public static function pagoRechazado(array $d, string $motivo): void
    {
        self::sinRomper(function () use ($d, $motivo) {
            self::paraPersona($d['paciente_id'], self::PAGO_RECHAZADO, 'Tu comprobante no fue aprobado',
                "Tu cita de {$d['servicio']} para el {$d['cuando']} se eliminó y el horario quedó libre. Motivo: {$motivo}",
                '/recibos');
            self::paraPersona($d['profesional_id'], self::CITA_ELIMINADA, 'Una cita reservada ya no va',
                "La cita de {$d['paciente']} para el {$d['cuando']} se eliminó porque su pago no fue aprobado. El horario quedó libre otra vez.",
                '/citas');
        });
    }

    public static function citaCancelada(Appointment $cita, bool $porElPaciente): void
    {
        self::sinRomper(function () use ($cita, $porElPaciente) {
            $d = self::datosDeCita($cita);
            $quien = $porElPaciente ? "{$d['paciente']} canceló su cita" : "La fundación canceló la cita de {$d['paciente']}";
            self::paraPersona($d['profesional_id'], self::CITA_CANCELADA, 'Cita cancelada',
                "{$quien} de {$d['servicio']} del {$d['cuando']}. El horario quedó libre otra vez.",
                "/citas?cita={$d['id']}");
            if (! $porElPaciente) {
                self::paraPersona($d['paciente_id'], self::CITA_CANCELADA, 'Tu cita fue cancelada',
                    "La fundación canceló tu cita de {$d['servicio']} con {$d['profesional']} del {$d['cuando']}. Si tienes dudas, comunícate con la fundación.",
                    "/dashboard?cita={$d['id']}");
            }
        });
    }

    public static function reporteListo(Appointment $cita): void
    {
        self::sinRomper(function () use ($cita) {
            $d = self::datosDeCita($cita);
            self::paraPersona($d['paciente_id'], self::REPORTE_LISTO, 'Ya está el reporte de tu sesión',
                "{$d['profesional']} subió el reporte de tu cita de {$d['servicio']} del {$d['cuando']}. Lo encuentras en Reportes.",
                '/reportes');
        });
    }

    /**
     * Secretaría o el Admin aprobaron un horario, o le quitaron la aprobación: se entera su profesional.
     * Los horarios se suelen aprobar de a muchos: mientras el profesional no lea el aviso, los siguientes
     * se suman a ese mismo ("Aprobaron 5 horarios tuyos") en vez de llenarle la lista de avisos iguales.
     */
    public static function horarioAprobado(WorkerSchedule $horario, bool $aprobado): void
    {
        self::sinRomper(function () use ($horario, $aprobado) {
            $franja = self::franja($horario);
            if ($aprobado) {
                $cuenta = self::cuentaDe((int) $horario->professional_id);
                if (! $cuenta || $cuenta === (int) auth()->id()) {
                    return;
                }
                $anterior = self::where('user_account_id', $cuenta)->where('tipo', self::HORARIO_APROBADO)->whereNull('leido_el')->orderByDesc('aviso_id')->first();
                $van = (int) ($anterior?->cantidad ?? 0) + 1;
                $anterior?->delete();
                if ($van === 1) {
                    self::paraCuenta($cuenta, self::HORARIO_APROBADO, 'Tu horario fue aprobado',
                        "Tu horario del {$franja} ({$horario->modalidad}), ya se ofrece a las familias.", '/seleccionar-horario');
                } else {
                    self::paraCuenta($cuenta, self::HORARIO_APROBADO, "Aprobaron {$van} horarios tuyos",
                        "Ya se ofrecen a las familias. El último que se aprobó: el del {$franja} ({$horario->modalidad}).", '/seleccionar-horario', $van);
                }
            } else {
                self::paraPersona((int) $horario->professional_id, self::HORARIO_POR_APROBAR, 'Un horario tuyo dejó de ofrecerse',
                    "Tu horario del {$franja} volvió a quedar por aprobar: mientras tanto no se ofrece a las familias.", '/seleccionar-horario');
            }
        });
    }

    /**
     * Cambió la modalidad o el enlace de un horario.
     * - Si lo cambió la fundación, se entera su profesional.
     * - Si el horario tiene una cita vigente, se entera el paciente: de la modalidad nueva, siempre; del
     *   enlace, solo cuando ya puede verlo (cita Agendada).
     */
    public static function horarioCambiado(WorkerSchedule $horario, bool $cambioModalidad, bool $cambioEnlace, ?Appointment $cita, bool $porLaFundacion): void
    {
        if (! $cambioModalidad && ! $cambioEnlace) {
            return;
        }

        self::sinRomper(function () use ($horario, $cambioModalidad, $cambioEnlace, $cita, $porLaFundacion) {
            $virtual = $horario->esVirtual();
            $conEnlace = $virtual && trim((string) $horario->enlace_virtual) !== '';

            if ($porLaFundacion) {
                $detalle = ! $virtual ? '' : ($conEnlace ? ', con el enlace de la reunión puesto' : ', todavía sin el enlace de la reunión');
                self::paraPersona((int) $horario->professional_id, self::HORARIO_CAMBIADO, 'La fundación cambió un horario tuyo',
                    'Tu horario del '.self::franja($horario).", quedó como {$horario->modalidad}{$detalle}.",
                    $cita ? "/citas?cita={$cita->appointment_id}" : '/seleccionar-horario');
            }

            if (! $cita || ! in_array((int) $cita->appointment_status_id, [self::CITA_GUARDADA, self::CITA_AGENDADA], true)) {
                return;
            }
            $d = self::datosDeCita($cita);
            if ($cambioModalidad) {
                $sigue = $virtual
                    ? 'Cuando esté el enlace de la reunión, lo verás en el detalle de la cita, en tu calendario.'
                    : 'La atención será en la fundación.';
                self::paraPersona($d['paciente_id'], self::CITA_MODALIDAD, "Tu cita ahora es {$horario->modalidad}",
                    "Tu cita de {$d['servicio']} con {$d['profesional']} del {$d['cuando']} ahora es {$horario->modalidad}. {$sigue}",
                    "/dashboard?cita={$d['id']}");
            } elseif ($conEnlace && $d['estado'] === self::CITA_AGENDADA) {
                self::paraPersona($d['paciente_id'], self::CITA_ENLACE, 'Ya está el enlace de tu cita virtual',
                    "El enlace para entrar a tu cita de {$d['servicio']} del {$d['cuando']} ya está en tu calendario: abre la cita y toca «Entrar a la reunión».",
                    "/dashboard?cita={$d['id']}");
            }
        });
    }

    // ── Textos ────────────────────────────────────────────────────────────────

    private static function sinRomper(callable $tarea): void
    {
        try {
            $tarea();
        } catch (\Throwable $e) {
            report($e);
        }
    }

    private static function nombre(?Person $persona): string
    {
        $nombre = trim(($persona?->first_name ?? '').' '.($persona?->last_name ?? ''));

        return $nombre !== '' ? $nombre : 'Una persona';
    }

    /** "martes 14 de octubre": la fecha de un turno, tal como está guardada (hora de Ecuador). */
    private static function dia(?Schedule $turno): ?string
    {
        if (! $turno) {
            return null;
        }
        $fecha = substr((string) $turno->getRawOriginal('date'), 0, 10);

        return Carbon::parse($fecha)->locale('es')->isoFormat('dddd D [de] MMMM');
    }

    /** "martes 14 de octubre a las 09:00" */
    private static function cuando(?WorkerSchedule $horario): string
    {
        $turno = $horario?->schedule;
        $dia = self::dia($turno);

        return $dia === null ? 'día acordado' : $dia.' a las '.substr((string) $turno->start_time, 0, 5);
    }

    /** "martes 14 de octubre, de 09:00 a 10:00" */
    private static function franja(WorkerSchedule $horario): string
    {
        $horario->loadMissing('schedule');
        $turno = $horario->schedule;
        $dia = self::dia($turno);

        return $dia === null ? 'día acordado' : $dia.', de '.substr((string) $turno->start_time, 0, 5).' a '.substr((string) $turno->end_time, 0, 5);
    }
}
