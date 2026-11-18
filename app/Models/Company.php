<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
    protected $fillable = [
        'name',
        'city',
        'address',
        'phone',
        'email',
        'country',
        'gemini_api_key',
        'token',
    ];

    protected static function booted(): void
    {
        static::creating(function (Company $company) {
            if (empty($company->token)) {
                do {
                    $token = Str::random(32);
                } while (static::where('token', $token)->exists());

                $company->token = $token;
            }
        });
    }

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
    // جوة موديل Company.php
    public function bags()
    {
        return $this->hasMany(Bag::class);
    }
}
