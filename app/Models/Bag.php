<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bag extends Model
{
    use HasFactory;

    /**
     * الحقول القابلة للتعبئة تلقائياً.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'consulate_entry_date',
        'company_id',
    ];

    /**
     * تحديد نوع الحقول لتتعامل معها لارافيل كـ Carbon Instance تلقائياً.
     */
    protected $casts = [
        'consulate_entry_date' => 'datetime', // أو 'date' لو غيرتها في الميجريشن
    ];

    /**
     * علاقة الحقيبة بالشركة (الحقيبة تنتمي لشركة واحدة).
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
    /**
     * جلب جميع العملاء الموجودين داخل هذه الحقيبة
     */
    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'bag_customer')->withTimestamps();
    }
}
