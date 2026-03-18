<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    use HasFactory;

    protected $table = 'gender';

    protected $primaryKey = 'gender_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'gender_id', 'gender_id');
    }
}
