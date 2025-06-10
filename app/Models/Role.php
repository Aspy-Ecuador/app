<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'role';
    protected $primaryKey = 'role_id';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function users()
    {
        return $this->hasMany(UserAccount::class, 'role_id');
    }
}
