<?php

namespace App\Http\Controllers;

use App\Models\Due;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DueController extends Controller
{
    public function index()
    {
        $dues = Due::latest()->get();

        return Inertia::render('Dues/Index', [
            'dues' => $dues,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
        ], [
            'name.required' => 'اسم الاستحقاق مطلوب',
            'amount.required' => 'المبلغ مطلوب',
        ]);

        Due::create($validated);

        return redirect()->back()->with('success', 'تم تعريف الاستحقاق بنجاح');
    }

    public function destroy(Due $due)
    {
        $due->delete();

        return redirect()->back()->with('success', 'تم حذف الاستحقاق بنجاح');
    }
}
