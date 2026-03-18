<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionalService extends Model
{
    use HasFactory;

    protected $table = 'professional_service';

    protected $primaryKey = 'professional_service_id';

    protected $fillable = [
        'service_id',
        'professional_id',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'service_id');
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class, 'professional_id', 'person_id');
    }
}
