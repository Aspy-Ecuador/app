<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Identification extends Model
{
    protected $table = 'identification';
    protected $primaryKey = 'identification_id';
    public $timestamps = false;
    protected $fillable = [
        'person_id',
        'type',
        'number',
        'due_date',
        'created_by',
        'modified_by',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class);
    }
}
