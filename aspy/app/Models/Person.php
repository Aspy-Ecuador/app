<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = 'person';
    protected $primaryKey = 'person_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'birthdate',
        'gender',
        'occupation',
        'marital_status',
        'education',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'birthdate',
        'creation_date',
        'modification_date',
    ];

    // Relationships
    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'user_id', 'user_id');
    }

    public function client()
    {
        return $this->hasOne(Client::class, 'person_id', 'person_id');
    }

    public function staff()
    {
        return $this->hasOne(Staff::class, 'person_id', 'person_id');
    }

    public function professional()
    {
        return $this->hasOne(Professional::class, 'person_id', 'person_id');
    }

    public function identifications()
    {
        return $this->hasOne(Identification::class, 'person_id', 'person_id');
    }

    public function addresses()
    {
        return $this->hasOne(Address::class, 'person_id', 'person_id');
    }

    public function phones()
    {
        return $this->hasOne(Phone::class, 'person_id', 'person_id');
    }

    public function workerSchedules()
    {
        return $this->hasMany(WorkerSchedule::class, 'person_id', 'person_id');
    }

    public function scheduledAppointments()
    {
        return $this->hasMany(Appointment::class, 'scheduled_by', 'person_id');
    }
}