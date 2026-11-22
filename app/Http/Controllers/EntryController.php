<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\Customer;
use App\Models\Group;
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

        // return $entries;
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
            'customer_id'       => 'required|exists:customers,id',
            'treasury_id'       => 'required|exists:treasuries,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'debit'             => 'required|numeric|min:0',
            'credit'            => 'required|numeric|min:0',
            'description'       => 'nullable|string|max:500',
            'receipt'           => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120', // بحد أقصى 5 ميجا
        ], [
            'customer_id.required'       => 'يرجى اختيار العميل',
            'treasury_id.required'       => 'يرجى اختيار الخزنة',
            'payment_method_id.required' => 'يرجى اختيار طريقة الاستلام',
            'debit.required'             => 'حقل المدين مطلوب',
            'credit.required'            => 'حقل الدائن مطلوب',
            'receipt.mimes'              => 'يجب أن يكون الريسيت صورة (jpg, png, webp) أو ملف PDF',
            'receipt.max'                => 'حجم ملف الريسيت يجب ألا يتجاوز 5 ميجابايت',
        ]);

        // في حالة رفع ملف ريسيت
        if ($request->hasFile('receipt')) {
            $validated['receipt'] = $request->file('receipt')->store('receipts', 'public');
        }

        Entry::create($validated);

        return redirect()->back()->with('success', 'تم تسجيل القيد بنجاح');
    }

    public function destroy(Entry $entry)
    {
        $entry->delete();

        return redirect()->back()->with('success', 'تم حذف القيد بنجاح');
    }

    public function financialReport(Group $group)
    {
        $group->load(['customers' => function ($query) {
            $query->withSum('dues as total_dues', 'amount')
                ->withSum('entries as total_debit', 'debit')   // المدين (الفلوس اللي دفعها)
                ->withSum('entries as total_credit', 'credit'); // الدائن (الفلوس اللي سحبها)
        }]);

        return Inertia::render('Groups/FinancialReport', [
            'group' => $group,
            'treasuries' => Treasury::all(['id', 'name']),
            'paymentMethods' => PaymentMethod::all(['id', 'name']),
        ]);
    }

    public function statement(Customer $customer)
    {
        // تحميل القيود مع بيانات الخزنة وطريقة الدفع مرتبة من الأحدث للأقدم (أو العكس)
        $customer->load([
            'entries' => function ($query) {
                $query->latest()->with(['treasury', 'paymentMethod']);
            },
            'dues'
        ]);

        return Inertia::render('Customers/Statement', [
            'customer' => $customer,
        ]);
    }
}
