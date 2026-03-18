<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professional extends Model
{
    use HasFactory;

    protected $table = 'professional';

    protected $primaryKey = 'person_id';

    public $incrementing = false;

    protected $fillable = [
        'person_id',
        'specialty',
        'title',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id', 'person_id');
    }

    public function workerSchedules()
    {
        return $this->hasMany(WorkerSchedule::class, 'professional_id', 'person_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'professional_id', 'person_id');
    }

    public function professionalServices()
    {
        return $this->hasMany(ProfessionalService::class, 'professional_id', 'person_id');
    }

    /*
    public function services()
    {
        return $this->belongsToMany(
            Service::class,
            'professional_service',
            'professional_id',
            'service_id',
            'person_id',
            'service_id'
        );
    }
    */
}
