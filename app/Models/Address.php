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
        'aga',
        'created_by',
        'modified_by',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class);
    }

    public function countryRelation()
    {
        return $this->belongsTo(Country::class, 'country');
    }

    public function provinceRelation()
    {
        return $this->belongsTo(State::class, 'province');
    }

    public function cityRelation()
    {
        return $this->belongsTo(City::class, 'city');
    }

    public function agaRelation()
    {
        return $this->belongsTo(Aga::class, 'aga');
    }
}
