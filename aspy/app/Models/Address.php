<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'address';
    protected $primaryKey = 'address_id';
    public $timestamps = false;

    protected $fillable = [
        'person_id',
        'type',
        'country',
        'province',
        'city',
        'primary_address',
        'secondary_address',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'creation_date',
        'modification_date',
    ];

    // Relationships
    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id', 'person_id');
    }

    public function countryData()
    {
        return $this->belongsTo(Country::class, 'country', 'country_id');
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'province', 'state_id');
    }

    public function cityData()
    {
        return $this->belongsTo(City::class, 'city', 'city_id');
    }
}