<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $table = 'discount';
    protected $primaryKey = 'discount_id';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'discount',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'discount_id');
    }
}
