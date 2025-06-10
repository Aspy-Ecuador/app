<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentData extends Model
{
    use HasFactory;

    protected $table = 'payment_data';
    protected $primaryKey = 'payment_data_id';
    public $timestamps = false;
    protected $fillable = [
        'type',
        'number',
        'file',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_data_id');
    }
}
