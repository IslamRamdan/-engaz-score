<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * عرض الموظفين فقط
     */
    public function index()
    {
        $employees = User::where('company_id', Auth::user()->company_id)
            ->where('role', 'employee')
            ->latest()
            ->get();

        return Inertia::render('Company/Employees/Index', [
            'employees' => $employees
        ]);
    }

    /**
     * إضافة موظف جديد
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'phone'    => 'nullable|string',
            'password' => 'required|min:6',
        ]);

        User::create([
            'company_id' => Auth::user()->company_id,
            'name'       => $request->name,
            'email'      => $request->email,
            'phone'      => $request->phone,
            'password'   => Hash::make($request->password),
            'role'       => 'employee',
            'is_active'  => true,
        ]);

        return back()->with('success', 'Employee created successfully');
    }

    /**
     * تعديل موظف
     */
    public function update(Request $request, User $user)
    {
        abort_if($user->company_id !== Auth::user()->company_id, 403);

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
        ]);

        $user->update($request->only([
            'name',
            'email',
            'phone'
        ]));

        return back()->with('success', 'Employee updated successfully');
    }

    /**
     * حذف موظف
     */
    public function destroy(User $user)
    {
        abort_if($user->company_id !== Auth::user()->company_id, 403);

        // ممنوع حذف owner
        if ($user->role === 'owner') {
            abort(403, 'Cannot delete owner');
        }

        $user->delete();

        return back()->with('success', 'Employee deleted successfully');
    }
}
