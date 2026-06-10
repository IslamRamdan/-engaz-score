<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CompanyRegisterController extends Controller
{
    /**
     * عرض صفحة التسجيل (اختياري لو هتبدأ منها)
     */
    public function create()
    {
        return Inertia::render('Auth/Register/Step1');
    }

    /**
     * تسجيل شركة + إنشاء أول مستخدم (Owner)
     */
    public function store(Request $request)
    {
        $request->validate([
            // بيانات الشركة
            'company_name' => 'required|string|max:255',
            'city'         => 'nullable|string|max:255',

            // بيانات المستخدم (Owner)
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'phone'        => 'nullable|string|max:20',
            'password'     => 'required|string|min:6|confirmed',
        ], [
            'company_name.required' => 'حقل اسم الشركة مطلوب ولا يمكن تركه فارغاً.',
            'company_name.max'      => 'يجب ألا يتجاوز اسم الشركة 255 حرفاً.',

            'city.max'              => 'يجب ألا يتجاوز اسم المدينة 255 حرفاً.',

            'name.required'         => 'حقل اسم المسؤول مطلوب.',
            'name.max'              => 'يجب ألا يتجاوز اسم المسؤول 255 حرفاً.',

            'email.required'        => 'حقل البريد الإلكتروني مطلوب للاتصال.',
            'email.email'           => 'الرجاء إدخال بريد إلكتروني بصيغة صحيحة.',
            'email.unique'          => 'هذا البريد الإلكتروني مسجل لدينا بالفعل.',

            'phone.max'             => 'يجب ألا يتجاوز رقم الجوال 20 رمزاً.',

            'password.required'     => 'حقل كلمة المرور مطلوب لحماية حسابك.',
            'password.min'          => 'يجب ألا تقل كلمة المرور عن 6 أحرف أو أرقام.',
            'password.confirmed'    => 'كلمة المرور وتأكيد كلمة المرور غير متطابقين.',
        ]);

        DB::beginTransaction();

        try {

            // 1. إنشاء الشركة
            $company = Company::create([
                'name'    => $request->company_name,
                'city'    => $request->city,
            ]);

            // 2. إنشاء المستخدم (Owner)
            $user = User::create([
                'company_id' => $company->id,
                'name'       => $request->name,
                'email'      => $request->email,
                'phone'      => $request->phone,
                'password'   => Hash::make($request->password),
                'role'       => 'owner',
                'is_active'  => true,
            ]);

            DB::commit();

            // تسجيل دخول تلقائي
            auth()->login($user);

            // تحويل للداشبورد أو صفحة نجاح
            return redirect()->route('dashboard');
        } catch (\Exception $e) {

            DB::rollBack();

            return back()->withErrors([
                'error' => 'Something went wrong: ' . $e->getMessage(),
            ]);
        }
    }
}
