<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    protected $table = 'state';

    protected $primaryKey = 'state_id';

    public $timestamps = false;

    protected $fillable = [
        'country_id',
        'name',
    ];

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
        return $this->hasMany(Address::class, 'state_id', 'state_id');
    }
}
