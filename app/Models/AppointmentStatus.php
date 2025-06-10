<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AppointmentStatus extends Model
{
    use HasFactory;
    protected $table = 'appointment_status';
    protected $primaryKey = 'status_id';
    
    protected $fillable = [
        'name',
    ];

    public $timestamps = false;

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'status');
    }
}
