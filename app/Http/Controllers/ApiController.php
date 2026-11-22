<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Delegate;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;


class ApiController extends Controller
{
    //

    public function sendEngaz(Request $request)
    {
        # code...
        $customer = Customer::find($request->customer_id);
        $group = Group::find($request->group);

        $group->customers()->updateExistingPivot($customer->id, [
            'enet_status' => 'booked',
            'e_number' => $request->e_number, // الرقم المرتجع من البوت (مثلاً appNo)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة النت بنجاح.',
        ]);
    }
    public function checkMedical(Request $request)
    {
        # code...
        $customer = Customer::find($request->customer_id);
        $group = Group::find($request->group_id);
        $group->customers()->updateExistingPivot($customer->id, [
            'medical_status' => 'booked',
            'medical_token' => $request->token_medical,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الفحص الطبي بنجاح.',
        ]);
    }
    public function storeMedicalResult(Request $request)
    {
        $group = Group::find($request->group);

        // البحث عن العميل باستخدام الـ token
        $customer = $group->customers()->wherePivot('medical_token', $request->token)->first();

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على العميل باستخدام الـ token المقدم.',
            ], 404);
        }

        $allowedStatus = ['fit', 'unfit', 'booked'];
        $requestStatus = $request->status ? strtolower($request->status) : null;

        $medicalStatus = in_array($requestStatus, $allowedStatus) ? $requestStatus : null;
        // دالة مساعدة لترجمة النصوص باستخدام MyMemory API
        $translateToArabic = function ($text) {
            if (empty($text)) {
                return null;
            }
            try {
                $response = Http::get("https://api.mymemory.translated.net/get", [
                    'q' => $text,
                    'langpair' => 'en|ar'
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return $data['responseData']['translatedText'] ?? $text;
                }
            } catch (\Exception $e) {
                Log::error('Translation Error: ' . $e->getMessage());
            }
            return $text; // في حال فشل الترجمة، يرجع النص الأصلي
        };

        // ترجمة اسم المستشفى وعنوانها إلى العربية
        $arabicHospitalName = $translateToArabic($request->hospital_name);
        $cleanedAddress = $request->cleanedAddress ? preg_replace('/\s+/', ' ', trim($request->cleanedAddress)) : '';
        $arabicAddress = $translateToArabic($cleanedAddress);

        // دمج الاسم والعنوان مع الترجمة
        $finalHospitalAddress = $arabicHospitalName . ' |--| ' . $arabicAddress;

        // تحديث حالة الفحص الطبي وبيانات المستشفى المترجمة
        $group->customers()->updateExistingPivot($customer->id, [
            'medical_status' => $medicalStatus,
            'hospital_address' => $finalHospitalAddress,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تخزين نتيجة الفحص الطبي وترجمتها بنجاح.',
        ]);
    }

    public function storeCustomer(Request $request)
    {
        $validatedData = $request->validate([
            'name_ar'           => 'required|string|max:255',
            'phone'             => [
                'required',
                'string',
                'max:20',
                Rule::unique('customers', 'phone'),
            ],
            'birth_date'        => 'nullable|date',
            'whatsapp'          => 'nullable|string|max:20',
            'company_token'        => 'required|exists:companies,token',
            'governorate'       => 'nullable|string|max:100',
            'national_id'       => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('customers', 'national_id'),
            ],
            'job_proof_image'   => 'nullable|image',
            'national_id_image' => 'nullable|image',
            'personal_image'    => 'nullable|image',
            'passport_image'    => 'nullable|image',
            "delegate_phone"      => "nullable|string",
        ], [
            'phone.unique'       => 'رقم الهاتف هذا مسجل لعميل آخر بالفعل.',
            'national_id.unique' => 'الرقم القومي هذا مسجل لعميل آخر بالفعل.',
            "delegate_phone.string" => "رقم المندوب يجب أن يكون نصًا.",
        ]);

        $imageFields = [
            'job_proof_image',
            'national_id_image',
            'personal_image',
            'passport_image',
        ];

        $company = Company::where('token', $request->company_token)->first();
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'الشركة غير موجودة.',
            ], 404);
        }
        $validatedData['company_id'] = $company->id;

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $validatedData[$field] = $request->file($field)->store('customers/attachments', 'public');
            }
        }

        $delegate = Delegate::where('phone', $request->delegate_phone)->first();

        $customer = Customer::create($validatedData);

        if ($delegate) {
            $customer->delegates()->attach($delegate->id, [
                'assigned_at' => now(),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء العميل بنجاح.',
            'data'    => $customer,
        ], 201);
    }
}
