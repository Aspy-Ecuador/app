<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserAccountStatus extends Model
{
    use HasFactory;

    protected $table = 'user_account_status';
    protected $primaryKey = 'status_id';
    
    protected $fillable = [
        'name',
    ];

    public $timestamps = false;

    public function users()
    {
        return $this->hasMany(UserAccount::class, 'status');
    }
}
