<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentData extends Model
{
    use HasFactory;

    protected $table = 'payment_data';

    protected $primaryKey = 'payment_data_id';

    protected $fillable = [
        'client_id',
        'type',
        'file',
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

    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_data_id', 'payment_data_id');
    }
}
