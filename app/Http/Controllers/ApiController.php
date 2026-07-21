<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

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
}
