<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaritalStatus extends Model
{
    use HasFactory;

    protected $table = 'marital_status';

    protected $primaryKey = 'marital_status_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'marital_status_id', 'marital_status_id');
    }
}
