<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    //
    public function netReservation(Customer $customer, Group $group)
    {
        // 1. التحقق من الصلاحية (بناءً على الشركة التابع لها المستخدم والمجموعة)
        if (auth()->user()->company_id !== $group->company_id) {
            abort(403, 'Unauthorized action.');
        }

        // 2. شحن علاقات المجموعات (وعلاقات العلاقات مثل الكفيل التابع للتأشيرة)
        // ملاحظة: تأكد أن اسم العلاقة داخل موديل Group هو visa (مفرد) كما كتبت بكودك
        $group->load([
            'visa.sponsor',
            'customers' => function ($query) use ($customer) {
                $query->where('customers.id', $customer->id)
                    ->withPivot([
                        'medical_status',
                        'medical_token',
                        'lab_status',
                        'enet_status',
                        'e_number'
                    ]);
            }
        ]);
        // إذا كنت تريد شحن علاقات للعميل أيضاً يمكنك كتابة:
        // $customer->load(['visas', 'bags']);

        // 3. تمرير البيانات إلى Inertia
        return Inertia::render('Reports/Net-reservation', [
            'customer' => $customer, // لارافيل يمرر الكائن كاملاً تلقائياً بفضل الـ Model Binding
            'group' => $group,
            'jobs'   => json_decode(file_get_contents(public_path('jops.json')), true),

        ]);
    }
    function nomination($customer_id, $group_id)
    {
        $customer = Customer::with([
            'groups' => function ($query) use ($group_id) {
                $query->where('groups.id', $group_id);
            },
            'groups.visa.sponsor' // هنا جلبنا الفيزا، وجلبنا الـ sponsor المرتبط بتلك الفيزا
        ])->find($customer_id);

        if ($customer->groups[0]->visa->consulate === 'القاهرة') {
            return Inertia::render('Reports/nomination_card/Cairo', [
                'customer' => $customer,
                'jobs'   => json_decode(file_get_contents(public_path('jops.json')), true),

            ]);
        } else {
            return Inertia::render('Reports/nomination_card/Suas', [
                'customer' => $customer,
                'jobs'   => json_decode(file_get_contents(public_path('jops.json')), true),

            ]);
        }
    }
}
