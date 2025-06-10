<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerSchedule extends Model
{
    use HasFactory;

    protected $table = 'worker_schedule';
    protected $primaryKey = 'worker_schedule_id';
    public $timestamps = false;
    protected $fillable = [
        'schedule_id',
        'person_id',
        'is_available',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'worker_schedule_id');
    }
}
