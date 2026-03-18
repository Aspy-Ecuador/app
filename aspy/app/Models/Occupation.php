<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occupation extends Model
{
    use HasFactory;

    protected $table = 'occupation';

    protected $primaryKey = 'occupation_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'occupation_id', 'occupation_id');
    }
}
