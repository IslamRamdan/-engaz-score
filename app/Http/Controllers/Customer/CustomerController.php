<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Delegate;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

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
            $companyId = auth()->user()->company_id; // جلب معرف الشركة للمستخدم الحالي
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
                'phone' => [
                    'nullable',
                    'string',
                    'max:20',
                    Rule::unique('customers', 'phone')->where(function ($query) use ($companyId) {
                        return $query->where('company_id', $companyId);
                    }),
                ],
                'whatsapp' => [
                    'nullable',
                    'string',
                    'max:20',
                    Rule::unique('customers', 'whatsapp')->where(function ($query) use ($companyId) {
                        return $query->where('company_id', $companyId);
                    }),
                ],
                'governorate' => ['nullable', 'string', 'max:100'],
                'address' => ['nullable', 'string'],

                // الجواز والهوية
                'passport_number' => [
                    'nullable',
                    'string',
                    'max:50',
                    Rule::unique('customers', 'passport_number')->where(function ($query) use ($companyId) {
                        return $query->where('company_id', $companyId);
                    }),
                ],
                'passport_issue_date' => ['nullable', 'date'],
                'passport_expiry_date' => ['nullable', 'date', 'after_or_equal:passport_issue_date'],
                'passport_issue_place' => ['nullable', 'string', 'max:150'],
                'mrz' => ['nullable', 'string'],
                'national_id' => [
                    'nullable',
                    'string',
                    'max:50',
                    Rule::unique('customers', 'national_id')->where(function ($query) use ($companyId) {
                        return $query->where('company_id', $companyId);
                    }),
                ],
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
                'phone.unique' => 'رقم الهاتف هذا مسجل مسبقاً لعميل آخر في شركتكم.',
                'whatsapp.unique' => 'رقم الواتساب هذا مسجل مسبقاً لعميل آخر في شركتكم.',
                'passport_number.unique' => 'رقم جواز السفر هذا مسجل مسبقاً لعميل آخر في شركتكم.',
                'national_id.unique' => 'الرقم القومي هذا مسجل مسبقاً لعميل آخر في شركتكم.',
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
        // جلب معرف الشركة للمستخدم الحالي
        $companyId = auth()->user()->company_id;

        // حماية: التأكد من أن العميل يخص نفس الشركة
        if ($customer->company_id !== $companyId) {
            abort(403);
        }

        // 1. الفاليديشن مع منع التكرار على مستوى النظام كاملاً باستثناء العميل الحالي (Ignore)
        $validated = $request->validate([
            'name_ar'              => ['required', 'string', 'max:255'],
            'name_en'              => ['nullable', 'string', 'max:255'],
            'gender'               => ['nullable', 'in:male,female'],
            'birth_date'           => ['nullable', 'date'],
            'nationality'          => ['nullable', 'string', 'max:100'],
            'marital_status'       => ['nullable', 'string', 'max:50'],

            // منع تكرار الهاتف والواتساب في النظام كله عدا العميل الحالي
            'phone'                => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('customers', 'phone')->ignore($customer->id)
            ],
            'whatsapp'             => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('customers', 'whatsapp')->ignore($customer->id)
            ],

            'governorate'          => ['nullable', 'string', 'max:100'],
            'address'              => ['nullable', 'string'],

            // منع تكرار جواز السفر والرقم القومي في النظام كله عدا العميل الحالي
            'passport_number'      => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('customers', 'passport_number')->ignore($customer->id)
            ],
            'passport_issue_date'  => ['nullable', 'date'],
            'passport_expiry_date' => ['nullable', 'date', 'after_or_equal:passport_issue_date'],
            'passport_issue_place' => ['nullable', 'string', 'max:150'],
            'mrz'                  => ['nullable', 'string'],

            'national_id'          => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('customers', 'national_id')->ignore($customer->id)
            ],

            'visa_number'          => ['nullable', 'string', 'max:50'],
            'e_number'             => ['nullable', 'string', 'max:50'],
            'notes'                => ['nullable', 'string'],

            // المندوب
            'delegate_id'          => ['nullable', 'exists:delegates,id'],

            // الملفات والصور
            'passport_image'       => ['nullable', 'file', 'image'],
            'personal_image'       => ['nullable', 'file', 'image'],
            'national_id_image'    => ['nullable', 'file', 'image'],
            'job_proof_image'      => ['nullable', 'file', 'image'],
        ], [
            // رسائل الخطأ بالعربية المحدثة لتناسب المنع العام
            'phone.unique'           => 'رقم الهاتف هذا مسجل مسبقاً لعميل آخر في النظام.',
            'whatsapp.unique'        => 'رقم الواتساب هذا مسجل مسبقاً لعميل آخر في النظام.',
            'passport_number.unique' => 'رقم جواز السفر هذا مسجل مسبقاً لعميل آخر في النظام.',
            'national_id.unique'     => 'الالرقم القومي هذا مسجل مسبقاً لعميل آخر في النظام.',
        ]);

        DB::transaction(function () use ($request, $customer, &$validated) {

            // 2. معالجة وتحديث الملفات والصور (حذف القديم من السيرفر فوراً إذا تم رفع جديد)
            $fileFields = ['passport_image', 'personal_image', 'national_id_image', 'job_proof_image'];
            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    // إذا كان الحقل يحتوي على مسار صورة قديمة، يتم حذفها من القرص تماماً
                    if ($customer->$field) {
                        Storage::disk('public')->delete($customer->$field);
                    }
                    // تخزين الصورة الجديدة في مجلد المرفقات
                    $validated[$field] = $request->file($field)->store('customers/attachments', 'public');
                } else {
                    // في حال عدم رفع ملف جديد، نحذف الحقل من مصفوفة التحديث ليبقى القديم مخزناً كما هو
                    unset($validated[$field]);
                }
            }

            // 3. عزل الـ delegate_id لمنع خطأ الـ SQL الحاد
            $newDelegateId = $validated['delegate_id'] ?? null;
            $customerData = array_diff_key($validated, array_flip(['delegate_id']));

            // 4. تحديث سجل العميل في جدول قاعدة البيانات الرئيسي
            $customer->update($customerData);

            // 5. تحديث المندوب في الجدول الوسيط إذا تغير عن المندوب الأخير للعميل
            $oldDelegateId = $customer->latestDelegate()->first()?->id;

            if ($newDelegateId != $oldDelegateId) {
                // إنهاء علاقة المندوب القديم عن طريق وضع تاريخ ended_at
                if ($oldDelegateId) {
                    $customer->delegates()->updateExistingPivot($oldDelegateId, [
                        'ended_at' => now(),
                        'changed_by' => Auth::id()
                    ]);
                }

                // إنشاء علاقة مع المندوب الجديد في سطر جديد بالجدول الوسيط
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

        return redirect()->route('customers.index')->with('success', 'تم تحديث بيانات العميل بنجاح وحذف الملفات السابقة');
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

    public function extractPassport(Request $request)
    {
        $request->validate([
            'passport_image' => 'required|image|max:8192', // 8MB
        ]);

        $file = $request->file('passport_image');
        $base64Image = base64_encode(file_get_contents($file->getRealPath()));
        $mimeType = $file->getMimeType();

        $prompt = <<<PROMPT
أنت أداة استخراج بيانات من صور جوازات السفر. افحص الصورة المرفقة واستخرج البيانات التالية بدقة.
أعد فقط كائن JSON صالح بدون أي نص إضافي أو علامات markdown، بهذا الشكل بالضبط:

{
  "name_ar": "الاسم الكامل بالعربية إن وجد أو فارغ",
  "name_en": "الاسم كما هو مكتوب بالإنكليزية في الجواز (Given Names + Surname)",
  "gender": "male أو female أو فارغ",
  "birth_date": "YYYY-MM-DD أو فارغ",
  "nationality": "الجنسية بالعربية إن أمكن استنتاجها (مثال: يمني، مصري) أو الكود الموجود في الجواز",
  "passport_number": "رقم الجواز",
  "passport_issue_date": "YYYY-MM-DD أو فارغ",
  "passport_expiry_date": "YYYY-MM-DD أو فارغ",
  "passport_issue_place": "جهة الإصدار إن وجدت أو فارغ",
  "address": "العنوان باللغة العربية إن أمكن استنتاجه أو فارغ",
  "governorate": "باللغة العربية إن أمكن استنتاجها أو فارغ",
  "national_id": "الرقم القومي انجليزي إن وجد أو فارغ",
  "mrz": "سطرا الـ MRZ كاملين كما هما مطبوعين، مفصولين بـ \\n"
}

إذا كان أي حقل غير واضح أو غير موجود في الصورة، اجعل قيمته سلسلة نصية فارغة "".
لا تخترع بيانات غير موجودة في الصورة.
PROMPT;

        try {
            // جلب المفتاح بأمان عبر الكومبوننت config وليس env مباشرة
            $apiKey = config('services.gemini.key');

            $response = Http::timeout(30)->post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey,
                [
                    'contents' => [[
                        'parts' => [
                            ['text' => $prompt],
                            [
                                'inline_data' => [
                                    'mime_type' => $mimeType,
                                    'data' => $base64Image,
                                ],
                            ],
                        ],
                    ]],
                    'generationConfig' => [
                        'temperature' => 0,
                        'responseMimeType' => 'application/json', // يضمن إرجاع JSON نظيف من الموديل
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Gemini API error', ['body' => $response->body()]);
                return response()->json(['error' => 'فشل الاتصال بخدمة الاستخراج من المزود'], 502);
            }

            $text = data_get($response->json(), 'candidates.0.content.parts.0.text', '{}');

            // فك النص مباشرة لأن الاستجابة نقية بدون علامات ماردكاوم
            $data = json_decode($text, true);

            if (!is_array($data)) {
                Log::error('Gemini returned invalid JSON structure', ['returned_text' => $text]);
                return response()->json(['error' => 'تعذر تحليل وتنسيق بيانات الجواز المرجوعة'], 422);
            }

            // JSON_UNESCAPED_UNICODE تمنع تحول اللغة العربية لرموز مشفرة مثل \u0627\u0644
            return response()->json(['data' => $data], 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            Log::error('Passport extraction failed', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'حدث خطأ غير متوقع أثناء استخراج البيانات'], 500);
        }
    }
}
