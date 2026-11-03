<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\Customer;
use App\Models\Treasury;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntryController extends Controller
{
    public function index()
    {
        $entries = Entry::with(['customer', 'treasury', 'paymentMethod'])
            ->whereDate('created_at', today())
            ->latest()
            ->get();
        // $customers = Customer::all();
        $treasuries = Treasury::all();
        $paymentMethods = PaymentMethod::all();

        return Inertia::render('Entries/Index', [
            'entries' => $entries,
            // 'customers' => $customers,
            'treasuries' => $treasuries,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'treasury_id' => 'required|exists:treasuries,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'debit' => 'required|numeric|min:0',
            'credit' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:500',
        ], [
            'customer_id.required' => 'يرجى اختيار العميل',
            'treasury_id.required' => 'يرجى اختيار الخزنة',
            'payment_method_id.required' => 'يرجى اختيار طريقة الاستلام',
            'debit.required' => 'حقل المدين مطلوب',
            'credit.required' => 'حقل الدائن مطلوب',
        ]);

        Entry::create($validated);

        return redirect()->back()->with('success', 'تم تسجيل القيد بنجاح');
    }

    public function destroy(Entry $entry)
    {
        $entry->delete();

        return redirect()->back()->with('success', 'تم حذف القيد بنجاح');
    }
}
