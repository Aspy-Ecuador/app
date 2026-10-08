<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/** Constancia de que una persona aceptó la política de privacidad (ver ConsentimientoController). */
class UserConsent extends Model
{
    use HasFactory;

    protected $table = 'user_consents';
    protected $primaryKey = 'consent_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'policy_version',
        'ip_address',
        'accepted_at',
        'declaraciones',
        'calidad',
        'representante_nombre',
        'representante_identificacion',
        'user_agent',
        'revoked_at',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
        'revoked_at' => 'datetime',
        'declaraciones' => 'array',
    ];

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'user_id', 'user_account_id');
    }
}
