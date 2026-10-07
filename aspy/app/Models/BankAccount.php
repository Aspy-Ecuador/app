<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Cuenta bancaria de la fundación para las transferencias (una sola fila; la edita el Admin). */
class BankAccount extends Model
{
    protected $table = 'bank_account';

    protected $primaryKey = 'bank_account_id';

    public $timestamps = false;

    protected $fillable = [
        'bank_name',
        'account_type',
        'account_number',
        'holder_name',
        'holder_id',
        'modified_by',
        'modification_date',
    ];

    protected $casts = [
        'modification_date' => 'datetime',
    ];
}
