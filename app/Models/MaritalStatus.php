<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaritalStatus extends Model
{
    protected $table = 'marital_status';
    protected $primaryKey = 'marital_status_id';
    public $timestamps = false;
    protected $fillable = ['name'];

    public function people()
    {
        return $this->hasMany(Person::class);
    }
}
