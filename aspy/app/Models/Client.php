<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'client';

    protected $primaryKey = 'person_id';

    public $incrementing = false;

    protected $fillable = [
        'person_id',
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

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'client_id', 'person_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'client_id', 'person_id');
    }

    public function paymentData()
    {
        return $this->hasMany(PaymentData::class, 'client_id', 'person_id');
    }
}
