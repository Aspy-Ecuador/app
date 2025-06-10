<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    protected $table = 'appointment';
    protected $primaryKey = 'appointment_id';
    public $timestamps = false;

    protected $fillable = [
        'payment_id',
        'scheduled_by',
        'worker_schedule_id',
        'tracking_appointment',
        'status',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }

    public function scheduledBy()
    {
        return $this->belongsTo(Person::class, 'scheduled_by');
    }

    public function workerSchedule()
    {
        return $this->belongsTo(WorkerSchedule::class, 'worker_schedule_id');
    }

    public function trackingAppointment()
    {
        return $this->belongsTo(Appointment::class, 'tracking_appointment');
    }

    public function status()
    {
        return $this->belongsTo(AppointmentStatus::class, 'status');
    }

    public function appointmentReport()
    {
        return $this->hasOne(AppointmentReport::class, 'appointment_id');
    }
}
