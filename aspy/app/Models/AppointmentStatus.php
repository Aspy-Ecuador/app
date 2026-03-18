<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentStatus extends Model
{
    use HasFactory;

    protected $table = 'appointment_status';

    protected $primaryKey = 'appointment_status_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'appointment_status_id', 'appointment_status_id');
    }
}
