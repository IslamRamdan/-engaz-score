<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'visa_id',
        'notes',
    ];

    /**
     * علاقة المجموعة بالتأشيرة (كل مجموعة تتبع تأشيرة واحدة)
     */
    public function visa()
    {
        return $this->belongsTo(Visa::class);
    }

    /**
     * علاقة المجموعة بالعملاء (المجموعة بها العديد من العملاء)
     */
    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_group');
    }

    /**
     * علاقة المجموعة بالشركة (Multi-tenancy)
     */
    public function company()
    {
        return $this->belongsTo(Company::class); // تأكد من اسم موديل الشركة لديك
    }
}
