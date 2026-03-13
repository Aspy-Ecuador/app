<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentStatus extends Model
{
    protected $table = 'appointment_status';
    protected $primaryKey = 'status_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    // Relationships
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'status', 'status_id');
    }
}