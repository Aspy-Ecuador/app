<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'service';
    protected $primaryKey = 'service_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'price',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'creation_date',
        'modification_date',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships
    public function professionalServices()
    {
        return $this->hasMany(ProfessionalService::class, 'service_id', 'service_id');
    }

    public function professionals()
    {
        return $this->belongsToMany(Professional::class, 'professional_service', 'service_id', 'person_id', 'service_id', 'person_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'service_id', 'service_id');
    }
}