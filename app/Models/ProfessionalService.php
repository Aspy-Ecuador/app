<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfessionalService extends Model
{
    protected $table = 'professional_service';
    protected $primaryKey = 'professional_service_id';
    public $timestamps = false;
    protected $fillable = [
        'service_id',
        'person_id',
        'created_by',
        'modified_by',
    ];

    public function professional()
    {
        return $this->belongsTo(Professional::class, 'person_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
