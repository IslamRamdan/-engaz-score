<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
  /**
   * عرض قائمة الموظفين التابعين لنفس الشركة
   */
  public function index()
  {
    // جلب المستخدمين المربوطين بنفس شركة المستخدم الحالي المتصل (وحماية البيانات)
    $employees = User::where('company_id', auth()->user()->company_id)
      ->latest()
      ->get(['id', 'name', 'email', 'phone', 'role', 'is_active', 'created_at', 'engaz_email', 'engaz_password']);

    // إرسال الصلاحيات الثلاثة كاملة ومتوافقة مع السكيما والهوية السعودية
    $roles = [
      'owner'    => 'مالك المنشأة / المدير العام',
      'admin'    => 'مدير النظام',
      'employee' => 'موظف قياسي',
    ];

    return Inertia::render('Employees/Index', [
      'employees' => $employees,
      'roles'     => $roles
    ]);
  }

  /**
   * تخزين موظف جديد
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
      'phone' => ['nullable', 'string', 'max:20'],
      'password' => ['required', 'string', 'min:8', 'confirmed'],
      'is_active' => ['required', 'boolean'],
      'engaz_email' => ['nullable', 'string', 'max:255'],
      'engaz_password' => ['nullable', 'string', 'max:255'],
      'role' => ['required', Rule::in(['admin', 'employee', 'owner'])], // التحقق من القيمة المرسلة
    ]);

    User::create([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'phone' => $validated['phone'],
      'password' => Hash::make($validated['password']),
      'is_active' => $validated['is_active'],
      'role' => $validated['role'],
      'engaz_email' => $validated['engaz_email'] ?? null,
      'engaz_password' => $validated['engaz_password'] ?? null,
      'company_id' => auth()->user()->company_id, // ربطه بتلقائية بنفس شركة المستخدم الحالي
    ]);

    return redirect()->route('employees.index')
      ->with('success', 'تم إضافة الموظف بنجاح.');
  }

  /**
   * تحديث بيانات الموظف والدور
   */
  public function update(Request $request, $id)
  {
    // return $request;
    $employee = User::findOrFail($id);

    // حماية: منع تعديل حساب الـ owner من هذه الصفحة إذا لم يكن مسموحاً
    if ($employee->role === 'owner' && auth()->user()->role !== 'owner') {
      return redirect()->route('employees.index')->with('error', 'لا تملك صلاحية لتعديل بيانات مالك الشركة.');
    }

    $validated = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($employee->id)],
      'phone' => ['nullable', 'string', 'max:20'],
      'password' => ['nullable', 'string', 'min:8', 'confirmed'],
      'is_active' => ['required', 'boolean'],
      'role' => ['required', Rule::in(['owner', 'admin', 'employee'])],
      'engaz_email' => ['nullable', 'string', 'max:255'],
      'engaz_password' => ['nullable', 'string', 'max:255'],
    ]);

    $employee->name = $validated['name'];
    $employee->email = $validated['email'];
    $employee->phone = $validated['phone'];
    $employee->is_active = $validated['is_active'];
    $employee->role = $validated['role'];
    $employee->engaz_email = $validated['engaz_email'] ?? null;
    $employee->engaz_password = $validated['engaz_password'] ?? null;

    if (!empty($validated['password'])) {
      $employee->password = Hash::make($validated['password']);
    }

    $employee->save();

    return redirect()->route('employees.index')
      ->with('success', 'تم تحديث بيانات الموظف بنجاح.');
  }

  /**
   * حذف الموظف
   */
  public function destroy($id)
  {
    $employee = User::findOrFail($id);

    if (auth()->id() === $employee->id) {
      return redirect()->route('employees.index')->with('error', 'لا يمكنك حذف حسابك الحالي.');
    }

    if ($employee->role === 'owner') {
      return redirect()->route('employees.index')->with('error', 'لا يمكن حذف حساب مالك الشركة.');
    }

    // $employee->delete();

    return redirect()->route('employees.index')->with('success', 'تم حذف الموظف بنجاح.');
  }
}
