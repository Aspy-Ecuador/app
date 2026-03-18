<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = 'education';

    protected $primaryKey = 'education_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'education_id', 'education_id');
    }
}
