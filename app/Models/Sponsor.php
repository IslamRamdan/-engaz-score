<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'address',
        'id_number',
        'country',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function visas()
    {
        return $this->hasMany(Visa::class);
    }
}
