<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Occupation extends Model
{
    protected $table = 'occupation';
    protected $primaryKey = 'occupation_id';
    public $timestamps = false;
    protected $fillable = ['name'];

    public function people()
    {
        return $this->hasMany(Person::class);
    }
}
