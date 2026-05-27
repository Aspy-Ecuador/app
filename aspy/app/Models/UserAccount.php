<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserAccount extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use HasApiTokens;

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
        'is_available',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'last_login' => 'datetime',
        'is_available' => 'boolean',
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    public const CREATED_AT = 'creation_date';

    public const UPDATED_AT = 'modification_date';

    // Necesario para Authenticatable
    /*
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }
    */

    // Desactiva el manejo automático de timestamps
    public $timestamps = false;

    // Maneja las fechas manualmente en los eventos del modelo
    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->creation_date = now();
            $model->modification_date = null;
        });

        static::updating(function ($model) {
            $model->modification_date = now();
        });
    }

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