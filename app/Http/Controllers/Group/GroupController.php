<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use App\Models\Bag;
use App\Models\Group;
use App\Models\Visa;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    /**
     * عرض جميع المجموعات الخاصة بالشركة الحالية
     */
    public function index()
    {
        $companyId = Auth::user()->company_id;

        $groups = Group::where('company_id', $companyId)
            ->with(['visa'])
            ->withCount('customers')
            ->latest()
            ->get();

        // جلب التأشيرات أيضاً لتمريرها إلى المودال (Form) عند الإضافة والتعديل
        $visas = Visa::where('company_id', $companyId)->get(['id', 'name']);

        return Inertia::render('Groups/Index', [
            'groups' => $groups,
            'visas' => $visas,
            'jobs'   => json_decode(file_get_contents(public_path('jops.json')), true),

        ]);
    }

    /**
     * إنشاء مجموعة جديدة
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'visa_id' => 'required|exists:visas,id',
            'notes' => 'nullable|string',
            'customer_ids' => 'nullable|array',
            'customer_ids.*' => 'exists:customers,id',
        ]);

        $companyId = Auth::user()->company_id;

        // 1. إنشاء المجموعة
        $group = Group::create([
            'company_id' => $companyId,
            'name' => $request->name,
            'visa_id' => $request->visa_id,
            'notes' => $request->notes,
        ]);

        // 2. ربط العملاء بالمجموعة لو تم إرسالهم
        if ($request->has('customer_ids')) {
            $group->customers()->sync($request->customer_ids);
        }

        // تحويل المستخدم إلى صفحة المؤشر مع رسالة نجاح (تظهر عبر الـ Flash Messages)
        return redirect()->route('groups.index')->with('success', 'تم إنشاء المجموعة بنجاح.');
    }

    /**
     * عرض تفاصيل مجموعة معينة مع العملاء المشتركين فيها (كشف المجموعة)
     */
    // public function show($id)
    // {
    //     $companyId = Auth::user()->company_id;

    //     $group = Group::where('company_id', $companyId)
    //         ->with(['visa', 'customers'])
    //         ->findOrFail($id);

    //     return Inertia::render('Groups/Show', [
    //         'group' => $group
    //     ]);
    // }

    /**
     * تعديل بيانات المجموعة (الاسم، التأشيرة، الملاحظات)
     */
    public function update(Request $request, $id)
    {
        $companyId = Auth::user()->company_id;
        $group = Group::where('company_id', $companyId)->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'visa_id' => 'sometimes|required|exists:visas,id',
            'notes' => 'nullable|string',
        ]);

        $group->update($request->only(['name', 'visa_id', 'notes']));

        return redirect()->route('groups.index')->with('success', 'تم تحديث بيانات المجموعة بنجاح.');
    }

    /**
     * حذف المجموعة (Soft Delete)
     */
    public function destroy($id)
    {
        $companyId = Auth::user()->company_id;
        $group = Group::where('company_id', $companyId)->findOrFail($id);

        $group->delete();

        return redirect()->route('groups.index')->with('success', 'تم حذف المجموعة بنجاح.');
    }

    /**
     * إدارة العملاء داخل المجموعة (مزامنة العملاء)
     */
    public function syncCustomers(Request $request, $id)
    {
        $request->validate([
            'customer_ids' => 'required|array',
            'customer_ids.*' => 'exists:customers,id',
        ]);

        $companyId = Auth::user()->company_id;
        $group = Group::where('company_id', $companyId)->findOrFail($id);

        // التعديل هنا: استخدام syncWithoutDetaching بدلاً من sync
        $group->customers()->syncWithoutDetaching($request->customer_ids);

        return redirect()->back()->with('success', 'تم إضافة العملاء إلى المجموعة بنجاح.');
    }

    public function addCustomers(Request $request, $groupId)
    {
        // 1. التحقق من البيانات القادمة من الفرونت اند
        $validated = $request->validate([
            'customer_ids'   => 'required|array',
            'customer_ids.*' => 'exists:customers,id', // التأكد أن العملاء موجودون فعلاً في قاعدة البيانات
        ]);

        // 2. جلب المجموعة أو إرجاع 404 إذا لم تكن موجودة
        $group = Group::findOrFail($groupId);

        // 3. إضافة العملاء للمجموعة
        // استخدام sync بدون حذف العلاقات القديمة (بإضافة false كمعامل ثانٍ)
        // أو استخدم attach إذا كنت متأكداً أنهم غير مضافين مسبقاً
        $group->customers()->sync($validated['customer_ids'], false);

        // 4. العودة باستجابة نجاح (أو Redirect إذا كنت تستخدم Inertia.js)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'تم إضافة العملاء إلى المجموعة بنجاح.'
            ]);
        }

        return redirect()->back()->with('success', 'تم إضافة العملاء بنجاح.');
    }
    public function show($id)
    {
        $group = Group::with(['customers', 'visa'])
            ->where('company_id', auth()->user()->company_id)
            ->findOrFail($id);

        $visa = $group->visa;
        $sponsor = $visa ? $visa->sponsor : null;
        $sponsorName = $sponsor ? $sponsor->name : "غير متوفر";
        $id_number = $sponsor ? $sponsor->id_number : "غير متوفر";
        $issue_number = $visa ? $visa->issue_number : "غير متوفر";


        $allJobs = json_decode(file_get_contents(public_path('jops.json')), true);

        // 2. البحث عن اسم الوظيفة بناءً على الكود المخزن في notes
        $jobCode = $group->notes; // الكود الموجود في قاعدة البيانات
        $jobName = null;

        foreach ($allJobs as $job) {
            if ($job['Value'] == $jobCode) {
                $jobName = $job['Text'];
                break;
            }
        }

        return Inertia::render('Groups/Show', [
            'group' => $group,
            'customers' => $group->customers,
            'sponsorName' => $sponsorName,
            'issue_number' => $issue_number,
            'id_number' => $id_number,
            'job' => $jobName,
            'bags' => Bag::select('id', 'name')->get(), // جلب كل الحقائب المتاحة
            "user" => auth()->user(),
            "visa" => $visa,
            "sponsor" => $sponsor,
        ]);
    }
    public function removeCustomers(Request $request, Group $group)
    {
        $validated = $request->validate([
            'customer_ids' => ['required', 'array'],
            'customer_ids.*' => ['integer'],
        ]);

        $group->customers()->detach($validated['customer_ids']);

        return back()->with('success', 'تم إزالة العملاء من المجموعة بنجاح');
    }

    public function updateCustomerStatus(
        Request $request,
        Group $group,
        Customer $customer
    ) {
        $validated = $request->validate([
            'medical_status' => ['nullable', 'in:booked,fit,unfit'],
            'medical_token'  => ['nullable', 'string', 'max:255'],
            'lab_status'     => ['nullable', 'in:booked,positive,negative'],
            'enet_status'    => ['nullable', 'in:booked,not_booked'],
            'e_number'       => ['nullable', 'string', 'max:255'],
        ]);

        $group->customers()->updateExistingPivot(
            $customer->id,
            $validated
        );

        return back()->with('success', 'تم تحديث البيانات بنجاح');
    }
}
