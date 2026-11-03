<?php
// app/Http/Controllers/PaymentMethodController.php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $methods = PaymentMethod::latest()->get();

        return Inertia::render('PaymentMethods/Index', [
            'methods' => $methods
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:payment_methods,name',
        ], [
            'name.required' => 'يرجى إدخال اسم طريقة الاستلام',
            'name.unique' => 'طريقة الاستلام هذه مضافة مسبقاً',
        ]);

        PaymentMethod::create($validated);

        return redirect()->back()->with('success', 'تمت إضافة طريقة الاستلام بنجاح');
    }

    // دالة حذف طريقة الاستلام
    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();

        return redirect()->back()->with('success', 'تم حذف طريقة الاستلام بنجاح');
    }
}
