<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [

        // الشركة
        'company_id',
        'created_by',

        // البيانات الأساسية
        'name_ar',
        'name_en',

        // التواصل
        'phone',
        'whatsapp',

        // الميلاد
        'birth_date',

        // المندوب الحالي
        'delegate_id',

        // الجنسية / الهوية
        'nationality',
        'national_id',

        // الجواز
        'passport_number',
        'passport_issue_date',
        'passport_expiry_date',
        'passport_image',
        "passport_issue_place",
        "mrz",
        "national_id_image",

        // بطاقة شخصية
        'id_card_image',

        // إثبات المهنة
        'job_proof_image',

        // صور إضافية
        'personal_image',

        // العنوان
        'governorate',
        'address',

        // التأشيرة
        'visa_number',
        'e_number',

        // الحالة الاجتماعية
        'marital_status',

        // ملاحظات
        'notes',
        "gender",
    ];

    protected $casts = [
        'birth_date'            => 'date',
        'passport_issue_date'   => 'date',
        'passport_expiry_date'  => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getFullNameAttribute()
    {
        return $this->name_ar ?: $this->name_en;
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeCompany($query)
    {
        return $query->where('company_id', auth()->user()->company_id);
    }

    // Customer.php
    public function delegates()
    {
        return $this->belongsToMany(Delegate::class, 'customer_delegate')
            ->withPivot('assigned_at', 'ended_at', 'changed_by')
            ->withTimestamps();
    }

    public function latestDelegate()
    {
        return $this->belongsToMany(
            Delegate::class,
            'customer_delegate',
            'customer_id',
            'delegate_id'
        )
            ->wherePivotNull('ended_at')
            ->orderByDesc('customer_delegate.assigned_at');
    }

    protected static function booted()
    {
        static::creating(function ($customer) {

            if (auth()->check()) {

                $customer->company_id = auth()->user()->company_id;
                $customer->created_by = auth()->id();
            }
        });
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'customer_group')
            ->using(CustomerGroup::class) // هنا نربط الموديل الوسيط
            ->withPivot(['medical_status', 'medical_token', 'lab_status', 'enet_status', 'e_number'])
            ->withTimestamps();
    }
}
