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

    public const CREATED_AT = 'creation_date';

    public const UPDATED_AT = 'modification_date';

    // Desactiva el manejo automático de timestamps
    public $timestamps = false;

    // Maneja las fechas manualmente en los eventos del modelo
    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->creation_date = now();
            $model->modification_date = null;
        });

        static::updating(function ($model) {
            $model->modification_date = now();
        });
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'appointment_id');
    }
}