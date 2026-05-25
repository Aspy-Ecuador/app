<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReceiptStatus extends Model
{
    use HasFactory;

    protected $table = 'receipt_status';

    protected $primaryKey = 'receipt__status_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function receipts()
    {
        return $this->hasMany(Receipt::class, 'receipt_status_id', 'receipt_status_id');
    }
}
