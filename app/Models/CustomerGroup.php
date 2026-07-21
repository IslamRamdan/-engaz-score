<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CustomerGroup extends Pivot
{
    // تحديد اسم الجدول الوسيط بدقة
    protected $table = 'customer_group';

    // الحقول المسموح بتعبئتها (الحقول القديمة + الجديدة)
    protected $fillable = [
        'customer_id',
        'group_id',
        'medical_status',
        'medical_token',
        'lab_status',
        'enet_status',
        'e_number',
        'hospital_address',
    ];

    // إذا كنت تريد التعامل مع الحالات كـ Enums أو Casts مستقبلاً (اختياري)
    protected $casts = [
        'medical_status' => 'string',
        'lab_status' => 'string',
        'enet_status' => 'string',
        'hospital_address' => 'string',
    ];
}
