<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delegate extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'phone',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    // public function customers()
    // {
    //     return $this->belongsToMany(
    //         Customer::class,
    //         'customer_delegate'
    //     )
    //         ->withPivot([
    //             'assigned_at',
    //             'ended_at',
    //             'changed_by'
    //         ])
    //         ->withTimestamps();
    // }

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_delegate')
            ->withPivot('assigned_at', 'ended_at', 'changed_by')
            ->withTimestamps();
    }
}
