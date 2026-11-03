<?php

namespace App\Http\Controllers;

use App\Models\Treasury;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreasuryController extends Controller
{
    public function index()
    {
        $treasuries = Treasury::latest()->get();

        return Inertia::render('Treasuries/Index', [
            'treasuries' => $treasuries
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:treasuries,name',
        ], [
            'name.required' => 'يرجى إدخال اسم الخزنة',
            'name.unique' => 'اسم الخزنة مضاف مسبقاً',
        ]);

        Treasury::create($validated);

        return redirect()->back()->with('success', 'تمت إضافة الخزنة بنجاح');
    }

    public function destroy(Treasury $treasury)
    {
        $treasury->delete();

        return redirect()->back()->with('success', 'تم حذف الخزنة بنجاح');
    }
}
