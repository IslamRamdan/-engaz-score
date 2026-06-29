<?php

namespace App\Http\Controllers;

use App\Models\Bag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BagController extends Controller
{
    /**
     * 1. عرض الحقائب الخاصة بشركة المستخدم الحالي
     */
    public function index()
    {
        $bags = Bag::where('company_id', auth()->user()->company_id)
            ->withCount('customers') // دي اللي هتجيب الـ customers_count
            ->latest()
            ->get();

        return Inertia::render('Bags/Index', [
            'bags' => $bags
        ]);
    }

    /**
     * 2. عرض صفحة إضافة حقيبة جديدة
     */
    public function create()
    {
        // بما أن الحقيبة تتربط تلقائياً بشركة اليوزر، مش محتاجين نبعت لستة الشركات للفورم
        return Inertia::render('Bags/Create');
    }

    /**
     * 3. حفظ الحقيبة الجديدة في قاعدة البيانات
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'consulate_entry_date' => 'required|date',
        ]);

        // ربط الحقيبة بشركة المستخدم الحالي تلقائياً
        $validated['company_id'] = auth()->user()->company_id;

        Bag::create($validated);

        return redirect()->route('bags.index')->with('success', 'تم إضافة الحقيبة بنجاح');
    }

    /**
     * 4. عرض صفحة تعديل الحقيبة (مع التأكد أنها تابعة لشركة اليوزر)
     */
    public function edit(Bag $bag)
    {
        // حماية: لو اليوزر حاول يدخل على حقيبة مش تبع شركته يرجع خطأ 403
        if ($bag->company_id !== auth()->user()->company_id) {
            abort(403, 'غير مصرح لك بتعديل هذه الحقيبة');
        }

        return Inertia::render('Bags/Edit', [
            'bag' => $bag
        ]);
    }

    /**
     * 5. تحديث بيانات الحقيبة
     */
    public function update(Request $request, Bag $bag)
    {
        // حماية ضد التلاعب بالـ IDs
        if ($bag->company_id !== auth()->user()->company_id) {
            abort(403, 'غير مصرح لك بتحديث هذه الحقيبة');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'consulate_entry_date' => 'required|date',
        ]);

        $bag->update($validated);

        return redirect()->route('bags.index')->with('success', 'تم تحديث بيانات الحقيبة بنجاح');
    }

    /**
     * 6. حذف الحقيبة
     */
    public function destroy(Bag $bag)
    {
        // حماية ضد محاولات الحذف العشوائية عبر الـ API أو الـ URL
        if ($bag->company_id !== auth()->user()->company_id) {
            abort(403, 'غير مصرح لك بحذف هذه الحقيبة');
        }

        $bag->delete();

        return redirect()->route('bags.index')->with('success', 'تم حذف الحقيبة بنجاح');
    }

    public function addCustomersBulk(Request $request)
    {
        $request->validate([
            'customer_ids' => 'required|array',
            'customer_ids.*' => 'exists:customers,id',
            'bag_id' => 'required|exists:bags,id', // تأكد من اسم الجدول
        ]);

        $bag = Bag::findOrFail($request->bag_id);

        // ربط العملاء بالحقيبة (من خلال العلاقة المحددة في موديل Bag)
        $bag->customers()->syncWithoutDetaching($request->customer_ids);

        return back()->with('success', 'تم إضافة العملاء إلى الحقيبة بنجاح');
    }

    public function show(Bag $bag)
    {
        // التأكد أن الحقيبة تابعة للمستخدم الحالي
        if ($bag->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        return inertia('Bags/Show', [
            'bag' => $bag->load('customers'),
        ]);
    }
}
