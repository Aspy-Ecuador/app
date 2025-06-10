<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $table = 'receipt';
    protected $primaryKey = 'receipt_id';
    public $timestamps = false;
    protected $fillable = [
        'payment_id',
        'status',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}
