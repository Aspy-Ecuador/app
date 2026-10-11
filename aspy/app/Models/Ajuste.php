<?php

namespace App\Models;

use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;

/** Ajustes del sistema que decide el Admin (una fila por ajuste: clave → valor). */
class Ajuste extends Model
{
    /** Días que se conserva el comprobante de un pago rechazado. 0 = no se borra nunca. */
    public const COMPROBANTE_RECHAZADO_DIAS = 'comprobante_rechazado_dias';

    public const DIAS_PERMITIDOS = [0, 1, 3, 7, 15, 30];

    /** Si el Admin no eligió nada: un día (tiempo para recuperarlo si el rechazo fue un error). */
    public const DIAS_POR_DEFECTO = 1;

    /** Hasta cuándo se pueden crear horarios (profesionales y, si está habilitada, Secretaría). */
    public const HORARIO_ALCANCE = 'horario_alcance';

    /** Del más corto al más largo. Deben coincidir con `ALCANCES` de aspy-web/src/API/ajustesAPI.ts. */
    public const ALCANCES = ['dia', 'semana', 'dos_semanas', 'mes', 'dos_meses'];

    /** Si el Admin no eligió nada: el mes en curso. */
    public const ALCANCE_POR_DEFECTO = 'mes';

    /** "1" si Secretaría puede crear y quitar horarios de los profesionales. Por defecto, no. */
    public const HORARIO_SECRETARIA = 'horario_secretaria';

    /** El Admin no tiene el límite de arriba, pero tampoco crea horarios a más de un año. */
    public const HORARIO_TOPE_ADMIN_DIAS = 365;

    protected $table = 'ajuste';

    protected $primaryKey = 'clave';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = ['clave', 'valor', 'modified_by', 'modification_date'];

    protected $casts = ['modification_date' => 'datetime'];

    public static function comprobanteRechazadoDias(): int
    {
        $valor = self::whereKey(self::COMPROBANTE_RECHAZADO_DIAS)->value('valor');

        return $valor === null || ! in_array((int) $valor, self::DIAS_PERMITIDOS, true) ? self::DIAS_POR_DEFECTO : (int) $valor;
    }

    public static function horarioAlcance(): string
    {
        $valor = self::whereKey(self::HORARIO_ALCANCE)->value('valor');

        return in_array($valor, self::ALCANCES, true) ? $valor : self::ALCANCE_POR_DEFECTO;
    }

    public static function horarioSecretaria(): bool
    {
        return self::whereKey(self::HORARIO_SECRETARIA)->value('valor') === '1';
    }

    /**
     * Último día en que se puede crear un horario con ese alcance (por defecto, el vigente).
     * La semana va de lunes a domingo, igual que en la agenda.
     */
    public static function horarioHasta(?string $alcance = null): Carbon
    {
        $hoy = Carbon::today();

        return match ($alcance ?? self::horarioAlcance()) {
            'dia' => $hoy,
            'semana' => $hoy->endOfWeek(CarbonInterface::SUNDAY)->startOfDay(),
            'dos_semanas' => $hoy->addWeek()->endOfWeek(CarbonInterface::SUNDAY)->startOfDay(),
            'dos_meses' => $hoy->addMonthNoOverflow()->endOfMonth()->startOfDay(),
            default => $hoy->endOfMonth()->startOfDay(),
        };
    }
}
