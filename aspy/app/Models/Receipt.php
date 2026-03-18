<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $table = 'receipt';

    protected $primaryKey = 'receipt_id';

    protected $fillable = [
        'payment_id',
        'receipt_status_id',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    const CREATED_AT = 'creation_date';

    const UPDATED_AT = 'modification_date';

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'payment_id');
    }

    public function receiptStatus()
    {
        return $this->belongsTo(ReceiptStatus::class, 'receipt_status_id', 'receipt_status_id');
    }
}
