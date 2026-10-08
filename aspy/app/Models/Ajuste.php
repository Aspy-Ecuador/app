<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Ajustes del sistema que decide el Admin (una fila por ajuste: clave → valor). */
class Ajuste extends Model
{
    /** Días que se conserva el comprobante de un pago rechazado. 0 = no se borra nunca. */
    public const COMPROBANTE_RECHAZADO_DIAS = 'comprobante_rechazado_dias';

    public const DIAS_PERMITIDOS = [0, 1, 3, 7, 15, 30];

    /** Si el Admin no eligió nada: un día (tiempo para recuperarlo si el rechazo fue un error). */
    public const DIAS_POR_DEFECTO = 1;

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
}
