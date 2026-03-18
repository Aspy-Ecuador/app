<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccountStatus extends Model
{
    use HasFactory;

    protected $table = 'user_account_status';

    protected $primaryKey = 'user_account_status_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function userAccounts()
    {
        return $this->hasMany(UserAccount::class, 'status_id', 'user_account_status_id');
    }
}
