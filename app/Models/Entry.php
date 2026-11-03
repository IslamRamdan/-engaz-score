<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{

    protected $fillable = [
        'customer_id',
        'treasury_id',
        'payment_method_id',
        'debit',
        'credit',
        'description',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function treasury()
    {
        return $this->belongsTo(Treasury::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
