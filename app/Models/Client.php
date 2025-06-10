<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    protected $table = 'client';
    protected $primaryKey = 'person_id';
    public $timestamps = false;

    protected $fillable = [
        'person_id',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'person_id');
    }

    public function medicalProfile()
    {
        return $this->hasOne(MedicalProfile::class, 'person_id');
    }
}
