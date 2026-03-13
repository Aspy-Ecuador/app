<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class UserAccount extends Authenticatable
{
    use HasApiTokens;
    
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
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $dates = [
        'last_login',
        'creation_date',
        'modification_date',
    ];

    // Override password column name
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function accountStatus()
    {
        return $this->belongsTo(UserAccountStatus::class, 'status', 'status_id');
    }

    public function person()
    {
        return $this->hasOne(Person::class, 'user_id', 'user_id');
    }
}