<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedule';

    protected $primaryKey = 'schedule_id';

    protected $fillable = [
        'date',
        'start_time',
        'end_time',
        'name',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'date' => 'date',
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function workerSchedules()
    {
        return $this->hasMany(WorkerSchedule::class, 'schedule_id', 'schedule_id');
    }

    /*
    public function professionals()
    {
        return $this->belongsToMany(
            Professional::class,
            'worker_schedule',
            'schedule_id',
            'professional_id',
            'schedule_id',
            'person_id'
        );
    }
    */
}
