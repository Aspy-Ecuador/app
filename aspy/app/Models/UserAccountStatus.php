<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAccountStatus extends Model
{
    protected $table = 'user_account_status';
    protected $primaryKey = 'status_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    // Relationships
    public function userAccounts()
    {
        return $this->hasMany(UserAccount::class, 'status', 'status_id');
    }
}