<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointment';

    protected $primaryKey = 'appointment_id';

    protected $fillable = [
        'payment_id',
        'client_id',
        'professional_id',
        'worker_schedule_id',
        'appointment_status_id',
        'service_id',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'payment_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'person_id');
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class, 'professional_id', 'person_id');
    }

    public function workerSchedule()
    {
        return $this->belongsTo(WorkerSchedule::class, 'worker_schedule_id', 'worker_schedule_id');
    }

    public function appointmentStatus()
    {
        return $this->belongsTo(AppointmentStatus::class, 'appointment_status_id', 'appointment_status_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'service_id');
    }

    public function report()
    {
        return $this->hasOne(AppointmentReport::class, 'appointment_id', 'appointment_id');
    }
}
