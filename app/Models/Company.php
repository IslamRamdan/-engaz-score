<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'city',
        'address',
        'phone',
        'email',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function sponsors()
    {
        return $this->hasMany(Sponsor::class);
    }

    public function visas()
    {
        return $this->hasMany(Visa::class);
    }

    public function delegates()
    {
        return $this->hasMany(Delegate::class);
    }
}
