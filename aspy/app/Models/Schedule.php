<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $table = 'schedule';
    protected $primaryKey = 'schedule_id';
    public $timestamps = false;

    protected $fillable = [
        'date',
        'start_time',
        'end_time',
        'name',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'date',
        'creation_date',
        'modification_date',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    // Relationships
    public function workerSchedules()
    {
        return $this->hasMany(WorkerSchedule::class, 'schedule_id', 'schedule_id');
    }
}