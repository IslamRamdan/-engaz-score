<?php

// أضفنا \Delegate في نهاية الـ Namespace ليعرف لارافل مكانه الجديد
namespace App\Http\Controllers\Delegate;

// بما أن الكنترولر أصبح داخل مجلد فرعي، يجب عمل import للكنترولر الأساسي لكي يقرأه
use App\Http\Controllers\Controller;
use App\Models\Delegate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DelegateController extends Controller
{
    /**
     * عرض قائمة المندوبين الخاصين بشركة المستخدم الحالي فقط.
     */
    public function index(Request $request)
    {
        // جلب معرف شركة المستخدم الحالي المسجل
        $companyId = $request->user()->company_id;

        // جلب المندوبين التابعين للشركة مع ترتيبهم من الأحدث للأقدم
        $delegates = Delegate::where('company_id', $companyId)
            ->latest()
            ->get();

        // تمرير البيانات لصفحة الريأكت في مسار resources/js/Pages/Delegates/Index.tsx
        return Inertia::render('Delegates/Index', [
            'delegates' => $delegates
        ]);
    }

    /**
     * حفظ مندوب جديد في قاعدة البيانات.
     */
    public function store(Request $request)
    {
        // التحقق من المدخلات (Validation)
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ], [
            'name.required' => 'حقل الاسم مطلوب.',
            'phone.required' => 'حقل رقم الهاتف مطلوب.',
        ]);

        // إضافة معرف الشركة تلقائياً من بيانات المستخدم المسجل لمنع التلاعب بالأمان
        $validated['company_id'] = $request->user()->company_id;

        Delegate::create($validated);

        // إعادة التوجيه مع رسالة نجاح تظهر في الفرونت إند عبر Inertia Flash Messages
        return redirect()->back()->with('success', 'تم إضافة المندوب بنجاح.');
    }

    /**
     * تحديث بيانات مندوب حالي.
     */
    public function update(Request $request, Delegate $delegate)
    {
        // hماية أمنية: التأكد أن المندوب يتبع لنفس شركة المستخدم الحالي
        if ($delegate->company_id !== $request->user()->company_id) {
            abort(403, 'غير مصرح لك بتعديل هذا المندوب.');
        }

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $delegate->update($validated);

        return redirect()->back()->with('success', 'تم تحديث بيانات المندوب بنجاح.');
    }

    /**
     * حذف مندوب من النظام.
     */
    public function destroy(Request $request, Delegate $delegate)
    {
        // حماية أمنية: التأكد أن المندوب يتبع لنفس شركة المستخدم الحالي
        if ($delegate->company_id !== $request->user()->company_id) {
            abort(403, 'غير مصرح لك بحذف هذا المندوب.');
        }

        $delegate->delete();

        return redirect()->back()->with('success', 'تم حذف المندوب بنجاح.');
    }
}
