<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'Cita';
    public $timestamps = false;
    protected $fillable = ['idCita', 'cedulaPaciente', 'profesional', 'servicio', 'tipoConsulta', 'fecha', 'horaInicio', 'horaFin'];
    protected $primaryKey = 'idCita';

    public function pago()
    {
        return $this->hasOne(Pago::class, 'citaid', 'idCita');
    }

}
