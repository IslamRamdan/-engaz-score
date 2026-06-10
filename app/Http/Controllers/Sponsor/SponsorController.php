<?php

namespace App\Http\Controllers\Sponsor;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SponsorController extends Controller
{
    /**
     * عرض قائمة الكفلاء الخاصين بشركة المستخدم الحالي فقط.
     */
    public function index(Request $request)
    {
        // جلب معرف شركة المستخدم الحالي
        $companyId = $request->user()->company_id;

        // جلب الكفلاء التابعين للشركة مع ترتيبهم من الأحدث للأقدم
        $sponsors = Sponsor::where('company_id', $companyId)
            ->latest()
            ->get();

        // تمرير البيانات لصفحة الريأكت في مسار resources/js/Pages/Sponsors/Index.tsx
        return Inertia::render('Sponsors/Index', [
            'sponsors' => $sponsors
        ]);
    }

    /**
     * حفظ كفيل جديد في قاعدة البيانات.
     */
    public function store(Request $request)
    {
        // التحقق من المدخلات (Validation)
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'address'   => 'required|string|max:500',
            'id_number' => 'required|string|max:50',
            'country'   => 'required|string|max:100',
        ], [
            'name.required'      => 'حقل اسم الكفيل مطلوب.',
            'address.required'   => 'حقل العنوان مطلوب.',
            'id_number.required' => 'حقل رقم الهوية/السجل مطلوب.',
            'country.required'   => 'حقل الدولة مطلوب.',
        ]);

        // ربط الكفيل تلقائياً بشركة المستخدم الحالي لمنع التلاعب والأمان
        $validated['company_id'] = $request->user()->company_id;

        Sponsor::create($validated);

        return redirect()->back()->with('success', 'تم إضافة الكفيل بنجاح.');
    }

    /**
     * تحديث بيانات كفيل حالي.
     */
    public function update(Request $request, Sponsor $sponsor)
    {
        // حماية أمنية: التأكد أن الكفيل يتبع لنفس شركة المستخدم الحالي
        if ($sponsor->company_id !== $request->user()->company_id) {
            abort(403, 'غير مصرح لك بتعديل بيانات هذا الكفيل.');
        }

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'address'   => 'required|string|max:500',
            'id_number' => 'required|string|max:50',
            'country'   => 'required|string|max:100',
        ]);

        $sponsor->update($validated);

        return redirect()->back()->with('success', 'تم تحديث بيانات الكفيل بنجاح.');
    }

    /**
     * حذف كفيل من النظام.
     */
    public function destroy(Request $request, Sponsor $sponsor)
    {
        // حماية أمنية: التأكد أن الكفيل يتبع لنفس شركة المستخدم الحالي
        if ($sponsor->company_id !== $request->user()->company_id) {
            abort(403, 'غير مصرح لك بحذف هذا الكفيل.');
        }

        // سيقوم بحذف الكفيل (تأكد من إعداد حقول الخصائص في الـ Migration إذا كنت تريد حذف التأشيرات المرتبطة به أو تقييدها)
        $sponsor->delete();

        return redirect()->back()->with('success', 'تم حذف الكفيل بنجاح.');
    }
}
