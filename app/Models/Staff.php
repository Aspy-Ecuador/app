<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staff';
    protected $primaryKey = 'person_id';
    public $timestamps = false;
    protected $fillable = [
        'person_id',
        'created_by',
        'modified_by',
        'creation_date',
        'modification_date',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }
}
