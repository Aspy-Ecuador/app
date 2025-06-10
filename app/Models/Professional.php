<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professional extends Model
{
    use HasFactory;

    protected $table = 'professional';
    protected $primaryKey = 'person_id';
    public $timestamps = false;
    protected $fillable = [
        'person_id',
        'specialty',
        'title',
        'about',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function professionalServices()
    {
        return $this->hasMany(ProfessionalService::class, 'person_id');
    }

    public function workerSchedules()
    {
        return $this->hasMany(WorkerSchedule::class, 'person_id');
    }
}
