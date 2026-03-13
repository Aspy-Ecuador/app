<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'country';
    protected $primaryKey = 'country_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'phone_code',
    ];

    // Relationships
    public function states()
    {
        return $this->hasMany(State::class, 'country_id', 'country_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'country', 'country_id');
    }
}