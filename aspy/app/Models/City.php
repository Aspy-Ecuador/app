<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $table = 'city';

    protected $primaryKey = 'city_id';

    public $timestamps = false;

    protected $fillable = [
        'state_id',
        'name',
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id', 'state_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'city_id', 'city_id');
    }
}
