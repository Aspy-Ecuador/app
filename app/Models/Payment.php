<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payment';
    protected $primaryKey = 'payment_id';
    public $timestamps = false;
    protected $fillable = [
        'person_id',
        'service_id',
        'discount_id',
        'payment_data_id',
        'service_price',
        'discount_percentage',
        'total_amount',
        'status',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'person_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class, 'discount_id');
    }

    public function paymentData()
    {
        return $this->belongsTo(PaymentData::class, 'payment_data_id');
    }

    public function status()
    {
        return $this->belongsTo(PaymentStatus::class, 'status');
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class, 'payment_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'payment_id');
    }
}
