<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visa extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'type',
        'issue_number',
        'consulate',
        'sponsor_id',
        'issue_date_hijri',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function sponsor()
    {
        return $this->belongsTo(Sponsor::class);
    }
    public function groups()
    {
        return $this->hasMany(Group::class);
    }
}
