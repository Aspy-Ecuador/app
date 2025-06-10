<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

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
        'creation_date',
        'modification_date',
    ];

    public function workerSchedules()
    {
        return $this->hasMany(WorkerSchedule::class, 'schedule_id');
    }
}
