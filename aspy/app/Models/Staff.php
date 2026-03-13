<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $table = 'staff';
    protected $primaryKey = 'person_id';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'person_id',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'creation_date',
        'modification_date',
    ];

    // Relationships
    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id', 'person_id');
    }
}