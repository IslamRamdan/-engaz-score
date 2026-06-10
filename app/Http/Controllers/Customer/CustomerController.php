<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Group\GroupController;
use App\Models\Customer;
use App\Models\Delegate;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * صفحة إنشاء عميل
     */
    public function create()
    {
        return Inertia::render('Customers/Create', [
            'delegates' => Delegate::where('company_id', auth()->user()->company_id)
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            // 1. التحقق من البيانات مباشرة داخل الـ Controller
            $validated = $request->validate([
                // البيانات الأساسية
                'name_ar' => ['required', 'string', 'max:255'],
                'name_en' => ['nullable', 'string', 'max:255'],
                'gender' => ['nullable', 'in:male,female'],
                'birth_date' => ['nullable', 'date'],
                'nationality' => ['nullable', 'string', 'max:100'],
                'marital_status' => ['nullable', 'string', 'max:50'],

                // التواصل والعناوين
                'phone' => ['nullable', 'string', 'max:20'],
                'whatsapp' => ['nullable', 'string', 'max:20'],
                'governorate' => ['nullable', 'string', 'max:100'],
                'address' => ['nullable', 'string'],

                // الجواز والهوية
                'passport_number' => ['nullable', 'string', 'max:50'],
                'passport_issue_date' => ['nullable', 'date'],
                'passport_expiry_date' => ['nullable', 'date', 'after_or_equal:passport_issue_date'],
                'passport_issue_place' => ['nullable', 'string', 'max:150'],
                'mrz' => ['nullable', 'string'],
                'national_id' => ['nullable', 'string', 'max:50'],

                // التأشيرات
                'visa_number' => ['nullable', 'string', 'max:50'],
                'e_number' => ['nullable', 'string', 'max:50'],

                // الحالات
                'medical_status' => ['nullable', 'in:booked,fit,unfit'],
                'medical_token' => ['nullable', 'string', 'max:255'],
                'lab_status' => ['nullable', 'in:booked,positive,negative'],
                'enet_status' => ['nullable', 'in:booked,not_booked'],

                // ملاحظات
                'notes' => ['nullable', 'string'],

                // الملفات
                'passport_image' => ['nullable', 'file', 'image'],
                'personal_image' => ['nullable', 'file', 'image'],
                'national_id_image' => ['nullable', 'file', 'image'],
                'job_proof_image' => ['nullable', 'file', 'image'],

                // المندوب
                'delegate_id' => ['nullable', 'exists:delegates,id'],
            ], [
                // =========================
                // رسائل بالعربي
                // =========================

                'name_ar.required' => 'الاسم بالعربية مطلوب',
                'name_ar.string' => 'الاسم بالعربية يجب أن يكون نص',
                'name_ar.max' => 'الاسم بالعربية طويل جدًا',

                'name_en.string' => 'الاسم بالإنجليزية يجب أن يكون نص',

                'gender.in' => 'النوع يجب أن يكون ذكر أو أنثى',

                'birth_date.date' => 'تاريخ الميلاد غير صحيح',

                'nationality.max' => 'الجنسية طويلة جدًا',

                'phone.max' => 'رقم الهاتف غير صالح',
                'whatsapp.max' => 'رقم الواتساب غير صالح',

                'passport_number.max' => 'رقم الجواز طويل جدًا',
                'passport_issue_date.date' => 'تاريخ إصدار الجواز غير صحيح',
                'passport_expiry_date.date' => 'تاريخ انتهاء الجواز غير صحيح',
                'passport_expiry_date.after_or_equal' => 'تاريخ انتهاء الجواز يجب أن يكون بعد أو يساوي تاريخ الإصدار',

                'national_id.max' => 'الرقم القومي غير صالح',

                'medical_status.in' => 'حالة الكشف الطبي غير صحيحة',
                'lab_status.in' => 'حالة المعمل غير صحيحة',
                'enet_status.in' => 'حالة حجز النت غير صحيحة',

                'passport_image.image' => 'صورة الجواز يجب أن تكون صورة',
                'personal_image.image' => 'الصورة الشخصية يجب أن تكون صورة',
                'national_id_image.image' => 'صورة الهوية يجب أن تكون صورة',
                'job_proof_image.image' => 'إثبات المهنة يجب أن يكون صورة',

                'delegate_id.exists' => 'المندوب المختار غير موجود',
            ]);

            // استخدام الترانزأكشن لحماية كتابة الجداول
            DB::transaction(function () use ($request, &$validated) {

                // 2. معالجة وتخزين الملفات والصور المرفوعة (إن وجدت)
                $fileFields = ['passport_image', 'personal_image', 'national_id_image', 'job_proof_image'];
                foreach ($fileFields as $field) {
                    if ($request->hasFile($field)) {
                        $validated[$field] = $request->file($field)->store('customers/attachments', 'public');
                    }
                }

                // 3. تعيين قيم الشركة والمستخدم الحالي تلقائياً من الجلسة
                $validated['company_id'] = Auth::user()->company_id;
                $validated['created_by'] = Auth::id();

                $customerData = array_diff_key($validated, array_flip(['delegate_id']));
                // 4. إنشاء سجل العميل الأساسي
                $customer = Customer::create($customerData);

                // 5. ربط المندوب في الجدول الوسيط (customer_delegate) إذا تم اختياره
                if ($request->filled('delegate_id')) {
                    $customer->delegates()->attach($request->delegate_id, [
                        'assigned_at' => now(),
                        'changed_by'  => Auth::id(),
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            });

            return redirect()->route('customers.index')->with('success', 'تم حفظ العميل بنجاح');
        } catch (\Exception $e) {
            return back()->withInput()->withErrors([
                'error' => 'حدث خطأ أثناء الحفظ: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * صفحة عرض العملاء (اختياري)
     */
    public function index()
    {
        $customers = Customer::with('latestDelegate')
            ->where('company_id', auth()->user()->company_id)
            ->latest()
            ->get();

        $groups = Group::where('company_id', auth()->user()->company_id)->get();

        // dd($customers[0]->latestDelegate); // اختبار جلب آخر مندوب لكل عميل

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'groups' => $groups,
        ]);
    }

    public function edit(Customer $customer)
    {
        // التأكد أن العميل تابع لنفس الشركة (أمان إضافي)
        if ($customer->company_id !== auth()->user()->company_id) {
            abort(403, 'غير مصرح لك بتعديل بيانات هذا العميل.');
        }

        // جلب معرف آخر مندوب تم تعيينه للعميل إن وجد
        $currentDelegateId = $customer->latestDelegate()->first()?->id;

        // جلب قائمة المندوبين المتاحين للشركة لعرضهم في قائمة الاختيار (Dropdown)
        $delegates = Delegate::where('company_id', auth()->user()->company_id)->get(['id', 'name']);

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
            'current_delegate_id' => $currentDelegateId,
            'delegates' => $delegates
        ]);
    }

    /**
     * تحديث بيانات العميل في قاعدة البيانات
     */
    public function update(Request $request, Customer $customer)
    {
        if ($customer->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        // 1. الفاليديشن (نفس قواعد الـ store ولكن الـ name_ar مطلوب)
        $validated = $request->validate([
            'name_ar'              => ['required', 'string', 'max:255'],
            'name_en'              => ['nullable', 'string', 'max:255'],
            'gender'               => ['nullable', 'in:male,female'],
            'birth_date'           => ['nullable', 'date'],
            'nationality'          => ['nullable', 'string', 'max:100'],
            'marital_status'       => ['nullable', 'string', 'max:50'],
            'phone'                => ['nullable', 'string', 'max:20'],
            'whatsapp'             => ['nullable', 'string', 'max:20'],
            'governorate'          => ['nullable', 'string', 'max:100'],
            'address'              => ['nullable', 'string'],
            'passport_number'      => ['nullable', 'string', 'max:50'],
            'passport_issue_date'  => ['nullable', 'date'],
            'passport_expiry_date' => ['nullable', 'date', 'after_or_equal:passport_issue_date'],
            'passport_issue_place' => ['nullable', 'string', 'max:150'],
            'mrz'                  => ['nullable', 'string'],
            'national_id'          => ['nullable', 'string', 'max:50'],
            'visa_number'          => ['nullable', 'string', 'max:50'],
            'e_number'             => ['nullable', 'string', 'max:50'],
            'notes'                => ['nullable', 'string'],

            // المندوب
            'delegate_id'          => ['nullable', 'exists:delegates,id'],

            // الملفات يمكن أن تكون نصوص (المسار القديم) أو ملفات جديدة مرفوعة
            'passport_image'       => ['nullable', 'file', 'image'],
            'personal_image'       => ['nullable', 'file', 'image'],
            'national_id_image'    => ['nullable', 'file', 'image'],
            'job_proof_image'      => ['nullable', 'file', 'image'],
        ]);

        DB::transaction(function () use ($request, $customer, &$validated) {

            // 2. معالجة وتحديث الملفات والصور (حذف القديم إذا تم رفع جديد)
            $fileFields = ['passport_image', 'personal_image', 'national_id_image', 'job_proof_image'];
            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    // حذف الصورة القديمة من السيرفر إذا كانت موجودة فعلاً
                    if ($customer->$field) {
                        Storage::disk('public')->delete($customer->$field);
                    }
                    // تخزين الصورة الجديدة
                    $validated[$field] = $request->file($field)->store('customers/attachments', 'public');
                } else {
                    // إذا لم يرفع صورة جديدة، نحتفظ بالقيمة القديمة الموجودة في قاعدة البيانات
                    unset($validated[$field]);
                }
            }

            // 3. عزل الـ delegate_id لمنع خطأ الـ SQL الحاد
            $newDelegateId = $validated['delegate_id'] ?? null;
            $customerData = array_diff_key($validated, array_flip(['delegate_id']));

            // 4. تحديث جدول العميل الرئيسي
            $customer->update($customerData);

            // 5. تحديث المندوب في الجدول الوسيط إذا تغير عن المندوب الأخير للعميل
            $oldDelegateId = $customer->latestDelegate()->first()?->id;

            if ($newDelegateId != $oldDelegateId) {
                // إنهاء علاقة المندوب القديم بوضع ended_at
                if ($oldDelegateId) {
                    $customer->delegates()->updateExistingPivot($oldDelegateId, [
                        'ended_at' => now(),
                        'changed_by' => Auth::id()
                    ]);
                }

                // ربط المندوب الجديد في سطر جديد بالجدول الوسيط
                if ($newDelegateId) {
                    $customer->delegates()->attach($newDelegateId, [
                        'assigned_at' => now(),
                        'changed_by'  => Auth::id(),
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }
        });

        return redirect()->route('customers.index')->with('success', 'تم تحديث بيانات العميل بنجاح');
    }

    public function delegate_history($customer)
    {
        # code...
        $history = DB::table('customer_delegate')
            ->join('delegates', 'delegates.id', '=', 'customer_delegate.delegate_id')
            ->leftJoin('users', 'users.id', '=', 'customer_delegate.changed_by')
            ->where('customer_delegate.customer_id', $customer)
            ->select(
                'delegates.name as delegate_name',
                'delegates.phone',
                'users.name as changed_by_name',
                'customer_delegate.assigned_at',
                'customer_delegate.ended_at'
            )
            ->orderByDesc('customer_delegate.assigned_at')
            ->get();

        $customer = Customer::find($customer);

        return Inertia::render('Customers/DelegateHistory', [
            'customer_id'   => $customer->id,
            'customer_name' => $customer->name_ar ?: $customer->name_en,
            'history' => $history,
        ]);
    }
}
