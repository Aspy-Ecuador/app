<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserAccount extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'user_account';

    protected $primaryKey = 'user_account_id';

    protected $fillable = [
        'role_id',
        'status_id',
        'email',
        'password_hash',
        'last_login',
        'created_by',
        'modified_by',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'last_login' => 'datetime',
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    // Necesario para Authenticatable
    /*
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }
    */
    
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function status()
    {
        return $this->belongsTo(UserAccountStatus::class, 'status_id', 'user_account_status_id');
    }

    public function person()
    {
        return $this->hasOne(Person::class, 'user_id', 'user_account_id');
    }
}
