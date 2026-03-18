<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payment';

    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'client_id',
        'service_id',
        'payment_data_id',
        'payment_status_id',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'person_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'service_id');
    }

    public function paymentData()
    {
        return $this->belongsTo(PaymentData::class, 'payment_data_id', 'payment_data_id');
    }

    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class, 'payment_status_id', 'payment_status_id');
    }

    public function receipt()
    {
        return $this->hasOne(Receipt::class, 'payment_id', 'payment_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'payment_id', 'payment_id');
    }
}
