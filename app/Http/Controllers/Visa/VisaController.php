<?php

namespace App\Http\Controllers\Visa;

use App\Http\Controllers\Controller;
use App\Models\Visa;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisaController extends Controller
{
    /**
     * عرض قائمة التأشيرات الخاصة بشركة المستخدم الحالي مع الكفلاء المرتبطين بها.
     */
    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;

        // جلب التأشيرات التابعة للشركة مع بيانات الكفيل المرتبط بها (Eager Loading)
        $visas = Visa::where('company_id', $companyId)
            ->with('sponsor:id,name') // جلب الاسم والمعرف الخاص بالكفيل فقط لتحسين الأداء
            ->latest()
            ->get();

        // جلب قائمة الكفلاء المتاحين لنفس الشركة لاستخدامهم في القائمة المنسدلة بالفورم
        $sponsors = Sponsor::where('company_id', $companyId)
            ->select('id', 'name')
            ->get();

        return Inertia::render('Visas/Index', [
            'visas' => $visas,
            'sponsors' => $sponsors
        ]);
    }

    /**
     * حفظ تأشيرة جديدة في قاعدة البيانات.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'type'             => 'required|string|max:100',
            'issue_number'     => 'required|string|max:100',
            'consulate'        => 'required|string|max:255',
            'sponsor_id'       => 'required|exists:sponsors,id',
            'issue_date_hijri' => 'required|string|max:20', // التوثيق بالتاريخ الهجري
        ], [
            'name.required'             => 'حقل اسم التأشيرة مطلوب.',
            'type.required'             => 'حقل نوع التأشيرة مطلوب.',
            'issue_number.required'     => 'حقل رقم الصادر مطلوب.',
            'consulate.required'        => 'حقل القنصلية مطلوب.',
            'sponsor_id.required'       => 'حقل اختيار الكفيل مطلوب.',
            'sponsor_id.exists'         => 'الكفيل المحدد غير موجود في النظام.',
            'issue_date_hijri.required' => 'حقل تاريخ الإصدار الهجري مطلوب.',
        ]);

        // حماية أمنية: التأكد أن الكفيل المختار يخص نفس شركة المستخدم لمنع التلاعب بالـ IDs
        $sponsor = Sponsor::where('id', $request->sponsor_id)
            ->where('company_id', $request->user()->company_id)
            ->first();

        if (!$sponsor) {
            return redirect()->back()->withErrors(['sponsor_id' => 'غير مصرح لك بربط هذا الكفيل.']);
        }

        // إرفاق معرّف الشركة تلقائياً
        $validated['company_id'] = $request->user()->company_id;

        Visa::create($validated);

        return redirect()->back()->with('success', 'تم إضافة التأشيرة بنجاح.');
    }

    /**
     * تحديث بيانات تأشيرة حالية.
     */
    public function update(Request $request, Visa $visa)
    {
        // حماية أمنية: التأكد من ملكية التأشيرة للشركة الحالية
        if ($visa->company_id !== $request->user()->company_id) {
            abort(403, 'غير مصرح لك بتعديل هذه التأشيرة.');
        }

        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'type'             => 'required|string|max:100',
            'issue_number'     => 'required|string|max:100',
            'consulate'        => 'required|string|max:255',
            'sponsor_id'       => 'required|exists:sponsors,id',
            'issue_date_hijri' => 'required|string|max:20',
        ]);

        // التأكد من ملكية الكفيل الجديد المختار للشركة
        $sponsor = Sponsor::where('id', $request->sponsor_id)
            ->where('company_id', $request->user()->company_id)
            ->first();

        if (!$sponsor) {
            return redirect()->back()->withErrors(['sponsor_id' => 'غير مصرح لك بربط هذا الكفيل.']);
        }

        $visa->update($validated);

        return redirect()->back()->with('success', 'تم تحديث بيانات التأشيرة بنجاح.');
    }

    /**
     * حذف تأشيرة من النظام.
     */
    public function destroy(Request $request, Visa $visa)
    {
        // حماية أمنية: التأكد من ملكية التأشيرة للشركة الحالية
        if ($visa->company_id !== $request->user()->company_id) {
            abort(403, 'غير مصرح لك بحذف هذه التأشيرة.');
        }

        $visa->delete();

        return redirect()->back()->with('success', 'تم حذف التأشيرة بنجاح.');
    }
}
