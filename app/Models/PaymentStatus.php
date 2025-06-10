<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentStatus extends Model
{
    use HasFactory;

    protected $table = 'payment_status';
    protected $primaryKey = 'status_id';
    
    protected $fillable = [
        'name',
    ];

    public $timestamps = false;

    public function payments()
    {
        return $this->hasMany(Payment::class, 'status');
    }
}
