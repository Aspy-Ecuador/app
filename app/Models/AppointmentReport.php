<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentReport extends Model
{
    protected $table = 'appointment_report';
    protected $primaryKey = 'appointment_report_id';
    public $timestamps = false;
    protected $fillable = [
        'appointment_id',
        'comments',
        'sign',
        'created_by',
        'modified_by',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
