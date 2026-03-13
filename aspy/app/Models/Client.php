<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'client';
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

    public function payments()
    {
        return $this->hasMany(Payment::class, 'person_id', 'person_id');
    }
}