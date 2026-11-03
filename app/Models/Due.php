<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Due extends Model
{

    protected $fillable = [
        'name',
        'amount',
    ];

    // علاقة كثير إلى كثير مع العملاء
    public function customers()
    {
        return $this->belongsToMany(Customer::class);
    }
}
