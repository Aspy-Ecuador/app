<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table = 'Pago';

    protected $fillable = [
        'citaid',
        'metodopago',
        'fechapago',
        'comprobante'
    ]; 

    public $timestamps = false;
    protected $primaryKey = 'citaid';

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'citaid', 'idCita');
    }

}
