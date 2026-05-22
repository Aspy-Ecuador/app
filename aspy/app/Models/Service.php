<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $table = 'service';

    protected $primaryKey = 'service_id';

    protected $fillable = [
        'name',
        'price',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
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

    public function payments()
    {
        return $this->hasMany(Payment::class, 'service_id', 'service_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'service_id', 'service_id');
    }

    public function professionalServices()
    {
        return $this->hasMany(ProfessionalService::class, 'service_id', 'service_id');
    }

    /*
    public function professionals()
    {
        return $this->belongsToMany(
            Professional::class,
            'professional_service',
            'service_id',
            'professional_id',
            'service_id',
            'person_id'
        );
    }
    */
}