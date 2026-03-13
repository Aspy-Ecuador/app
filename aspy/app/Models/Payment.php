<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payment';
    protected $primaryKey = 'payment_id';
    public $timestamps = false;

    protected $fillable = [
        'person_id',
        'service_id',
        'payment_data_id',
        'service_price',
        'total_amount',
        'status',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'creation_date',
        'modification_date',
    ];

    protected $casts = [
        'service_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class, 'person_id', 'person_id');
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
        return $this->belongsTo(PaymentStatus::class, 'status', 'status_id');
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