<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{

    protected $table = 'gender';
    protected $primaryKey = 'gender_id';
    public $timestamps = false;
    protected $fillable = ['name'];

    public function people()
    {
        return $this->hasMany(Person::class);
    }
}
