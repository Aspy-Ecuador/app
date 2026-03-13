<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    protected $table = 'state';
    protected $primaryKey = 'state_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'country_id',
    ];

    // Relationships
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'country_id');
    }

    public function cities()
    {
        return $this->hasMany(City::class, 'state_id', 'state_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'province', 'state_id');
    }
}