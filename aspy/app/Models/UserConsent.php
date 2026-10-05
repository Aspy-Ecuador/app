<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'user_id', 'user_account_id');
    }
}
