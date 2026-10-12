<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerSchedule extends Model
{
    use HasFactory;

    protected $table = 'worker_schedule';

    protected $primaryKey = 'worker_schedule_id';

    public const PRESENCIAL = 'presencial';

    public const VIRTUAL = 'virtual';

    public const MODALIDADES = [self::PRESENCIAL, self::VIRTUAL];

    protected $fillable = [
        'schedule_id',
        'professional_id',
        'is_available',
        'modalidad',
        'enlace_virtual',
        'aprobado',
        'aprobado_por',
        'aprobado_el',
        'created_by',
        'modified_by',
    ];

    /**
     * El enlace de la reunión no sale al serializar el modelo: lo entregan solo los controladores,
     * que deciden si quien pregunta lo puede ver (WorkerScheduleController y AppointmentController).
     */
    protected $hidden = ['enlace_virtual'];

    /** Lo que vale un horario si no se indica otra cosa (también al serializar uno recién creado). */
    protected $attributes = [
        'modalidad' => self::PRESENCIAL,
        'aprobado' => true,
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'aprobado' => 'boolean',
        'aprobado_el' => 'datetime',
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

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id', 'schedule_id');
    }

    public function esVirtual(): bool
    {
        return $this->modalidad === self::VIRTUAL;
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class, 'professional_id', 'person_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'worker_schedule_id', 'worker_schedule_id');
    }
}