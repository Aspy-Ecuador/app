<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $table = 'city';
    protected $primaryKey = 'city_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'state_id',
    ];

    // Relationships
    public function state()
    {
        return $this->belongsTo(State::class, 'state_id', 'state_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'city', 'city_id');
    }
}