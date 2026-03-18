<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $table = 'address';

    protected $primaryKey = 'address_id';

    protected $fillable = [
        'person_id',
        'type',
        'country_id',
        'state_id',
        'city_id',
        'primary_address',
        'secondary_address',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id', 'person_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'country_id');
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id', 'state_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }
}
