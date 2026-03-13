<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkerSchedule extends Model
{
    protected $table = 'worker_schedule';
    protected $primaryKey = 'worker_schedule_id';
    public $timestamps = false;

    protected $fillable = [
        'schedule_id',
        'person_id',
        'is_available',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'creation_date',
        'modification_date',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    // Relationships
    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id', 'schedule_id');
    }

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id', 'person_id');
    }

    public function appointment()
    {
        return $this->hasOne(Appointment::class, 'worker_schedule_id', 'worker_schedule_id');
    }
}