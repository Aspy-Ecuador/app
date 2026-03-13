<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointment';
    protected $primaryKey = 'appointment_id';
    public $timestamps = false;

    protected $fillable = [
        'payment_id',
        'scheduled_by',
        'worker_schedule_id',
        'status',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'creation_date',
        'modification_date',
    ];

    // Relationships
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'payment_id');
    }

    public function scheduler()
    {
        return $this->belongsTo(Person::class, 'scheduled_by', 'person_id');
    }

    public function workerSchedule()
    {
        return $this->belongsTo(WorkerSchedule::class, 'worker_schedule_id', 'worker_schedule_id');
    }

    public function appointmentStatus()
    {
        return $this->belongsTo(AppointmentStatus::class, 'status', 'status_id');
    }

    public function appointmentReport()
    {
        return $this->hasOne(AppointmentReport::class, 'appointment_id', 'appointment_id');
    }
}