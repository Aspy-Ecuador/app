<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $table = 'service';
    protected $primaryKey = 'service_id';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'price',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function professionalServices()
    {
        return $this->hasMany(ProfessionalService::class, 'service_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'service_id');
    }
}
