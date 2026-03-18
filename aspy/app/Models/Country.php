<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $table = 'country';

    protected $primaryKey = 'country_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'phone_code',
    ];

    public function states()
    {
        return $this->hasMany(State::class, 'country_id', 'country_id');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'country_id', 'country_id');
    }
}
