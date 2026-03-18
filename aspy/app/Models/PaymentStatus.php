<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentStatus extends Model
{
    use HasFactory;

    protected $table = 'payment_status';

    protected $primaryKey = 'payment_status_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_status_id', 'payment_status_id');
    }
}
