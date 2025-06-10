<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $table = 'person';
    protected $primaryKey = 'person_id';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'first_name',
        'middle_name',
        'birthdate',
        'gender',
        'occupation',
        'marital_status',
        'education',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function user()
    {
        return $this->belongsTo(UserAccount::class, 'user_id');
    }

    public function client()
    {
        return $this->hasOne(Client::class, 'person_id');
    }

    public function staff()
    {
        return $this->hasOne(Staff::class, 'person_id');
    }

    public function professional()
    {
        return $this->hasOne(Professional::class, 'person_id');
    }

    public function identifications()
    {
        return $this->hasMany(Identification::class, 'person_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'person_id');
    }

    public function phones()
    {
        return $this->hasMany(Phone::class, 'person_id');
    }
}
