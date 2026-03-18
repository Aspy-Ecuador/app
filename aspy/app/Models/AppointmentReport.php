<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentReport extends Model
{
    use HasFactory;

    protected $table = 'appointment_report';

    protected $primaryKey = 'appointment_report_id';

    protected $fillable = [
        'appointment_id',
        'file',
        'sign',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'appointment_id');
    }
}
