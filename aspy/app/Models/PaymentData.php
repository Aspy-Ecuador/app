<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentData extends Model
{
    protected $table = 'payment_data';
    protected $primaryKey = 'payment_data_id';
    public $timestamps = false;

    protected $fillable = [
        'type',
        'number',
        'file',
        'created_by',
        'modified_by',
    ];

    protected $dates = [
        'creation_date',
        'modification_date',
    ];

    // Relationships
    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_data_id', 'payment_data_id');
    }
}