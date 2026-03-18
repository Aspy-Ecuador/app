<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $table = 'person';

    protected $primaryKey = 'person_id';

    protected $fillable = [
        'user_id',
        'gender_id',
        'occupation_id',
        'marital_status_id',
        'education_id',
        'first_name',
        'last_name',
        'birthdate',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'user_id', 'user_account_id');
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'gender_id', 'gender_id');
    }

    public function occupation()
    {
        return $this->belongsTo(Occupation::class, 'occupation_id', 'occupation_id');
    }

    public function maritalStatus()
    {
        return $this->belongsTo(MaritalStatus::class, 'marital_status_id', 'marital_status_id');
    }

    public function education()
    {
        return $this->belongsTo(Education::class, 'education_id', 'education_id');
    }

    public function phones()
    {
        return $this->hasMany(Phone::class, 'person_id', 'person_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'person_id', 'person_id');
    }

    public function identifications()
    {
        return $this->hasMany(Identification::class, 'person_id', 'person_id');
    }

    public function client()
    {
        return $this->hasOne(Client::class, 'person_id', 'person_id');
    }

    public function professional()
    {
        return $this->hasOne(Professional::class, 'person_id', 'person_id');
    }

    public function staff()
    {
        return $this->hasOne(Staff::class, 'person_id', 'person_id');
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
