<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalProfile extends Model
{
    protected $table = 'medical_profile';
    protected $primaryKey = 'medical_profile_id';
    public $timestamps = false;
    protected $fillable = [
        'person_id',
        'diagnose',
        'created_by',
        'modified_by',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'person_id');
    }
}
