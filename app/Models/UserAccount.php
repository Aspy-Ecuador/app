<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class UserAccount extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'user_account';
    protected $primaryKey = 'user_id';
    public $timestamps = false;

    protected $fillable = [
        'role_id',
        'email',
        'password_hash',
        'status',
        'last_login',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function status()
    {
        return $this->belongsTo(UserAccountStatus::class, 'status');
    }

    public function person()
    {
        return $this->hasOne(Person::class, 'user_id');
    }
}
