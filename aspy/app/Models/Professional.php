<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Professional extends Model
{
    protected $table = 'professional';
    protected $primaryKey = 'person_id';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'person_id',
        'specialty',
        'title',        
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

    public function professionalServices()
    {
        return $this->hasMany(ProfessionalService::class, 'person_id', 'person_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'professional_service', 'person_id', 'service_id', 'person_id', 'service_id');
    }
}