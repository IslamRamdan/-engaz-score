<?php

use App\Http\Controllers\Auth\CompanyRegisterController;
use App\Http\Controllers\Company\UserController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Delegate\DelegateController;
use App\Http\Controllers\Group\GroupController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Sponsor\SponsorController;
use App\Http\Controllers\Visa\VisaController;
use App\Models\Group;
use App\Models\Visa;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BagController;
use App\Models\Bag;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    // جلب آيدي الشركة المرتبطة باليوزر الحالي مباشرة
    $companyId = auth()->user()->company_id;

    return Inertia::render('Dashboard', [
        'groups' => Group::where('company_id', $companyId)->withCount('customers')->latest()->get(),
        'visas'  => Visa::where('company_id', $companyId)->latest()->get(),
        'bags'   => Bag::where('company_id', $companyId)->withCount('customers')->latest()->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// تسجيل دخول الشركة والاونر
Route::get('/register', [CompanyRegisterController::class, 'create']);
Route::post('/company/register', [CompanyRegisterController::class, 'store'])
    ->name('company.register');

Route::middleware(['auth'])->group(function () {

    Route::get('/employees', [UserController::class, 'index']);
    Route::post('/employees', [UserController::class, 'store']);
    Route::put('/employees/{user}', [UserController::class, 'update']);
    Route::delete('/employees/{user}', [UserController::class, 'destroy']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // مسارات المندوبين
    Route::get('/delegates', [DelegateController::class, 'index'])->name('delegates.index');
    Route::post('/delegates', [DelegateController::class, 'store'])->name('delegates.store');
    Route::put('/delegates/{delegate}', [DelegateController::class, 'update'])->name('delegates.update');
    Route::delete('/delegates/{delegate}', [DelegateController::class, 'destroy'])->name('delegates.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // مسارات إدارة الكفلاء
    Route::get('/sponsors', [SponsorController::class, 'index'])->name('sponsors.index');
    Route::post('/sponsors', [SponsorController::class, 'store'])->name('sponsors.store');
    Route::put('/sponsors/{sponsor}', [SponsorController::class, 'update'])->name('sponsors.update');
    Route::delete('/sponsors/{sponsor}', [SponsorController::class, 'destroy'])->name('sponsors.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // مسارات إدارة التأشيرات
    Route::get('/visas', [VisaController::class, 'index'])->name('visas.index');
    Route::post('/visas', [VisaController::class, 'store'])->name('visas.store');
    Route::put('/visas/{visa}', [VisaController::class, 'update'])->name('visas.update');
    Route::delete('/visas/{visa}', [VisaController::class, 'destroy'])->name('visas.destroy');
});

Route::middleware(['auth'])->group(function () {

    // عرض كل العملاء
    Route::get('/customers', [CustomerController::class, 'index'])
        ->name('customers.index');

    // صفحة إنشاء عميل
    Route::get('/customers/create', [CustomerController::class, 'create'])
        ->name('customers.create');

    // حفظ عميل
    Route::post('/customers', [CustomerController::class, 'store'])
        ->name('customers.store');

    // صفحة تعديل عميل
    Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])
        ->name('customers.edit');

    // تحديث عميل
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])
        ->name('customers.update');

    // تاريخ المندوبين لكل عميل
    Route::get('/customers/delegate/{id}', [CustomerController::class, 'delegate_history'])
        ->name('customer.delegate_history');

    // اضافة عميل إلى مجموعة

});

Route::middleware(['auth', 'verified'])->group(function () {

    // الروتس الأساسية للمجموعات (Index, Create, Store, Show, Edit, Update, Destroy)
    // نستخدم apiResource إذا كنا نريد JSON فقط، لكن بما أننا نستخدم Inertia فـ resource هي الأنسب
    Route::resource('groups', GroupController::class);

    // رووت خاص لمزامنة العملاء (إضافة/حذف عملاء من مجموعة)
    // نضعه هنا لأننا سنحتاج ربما لصفحة React مخصصة للـ Sync
    Route::post('groups/{id}/sync-customers', [GroupController::class, 'syncCustomers'])
        ->name('groups.sync-customers');

    Route::post('/groups/{groupId}/customers/add', [GroupController::class, 'addCustomers'])
        ->name('groups.customers.add');

    Route::get('/groups/{id}', [GroupController::class, 'show'])
        ->name('groups.show');

    // روت لحذف عملاء من المجموعة
    Route::post(
        '/groups/{group}/customers/remove',
        [GroupController::class, 'removeCustomers']
    )->name('groups.remove-customers');

    Route::delete(
        '/groups/{group}/customers/remove',
        [GroupController::class, 'removeCustomers']
    )->name('groups.remove-customers');

    Route::put('/groups/{group}/customers/{customer}/status', [GroupController::class, 'updateCustomerStatus'])
        ->name('groups.customers.status.update');
});


Route::resource('bags', BagController::class);

Route::middleware(['auth'])->group(function () {
    // الروت الخاص بإضافة العملاء بكميات كبيرة إلى مجموعة أخرى
    // Route::post('/groups/add-customers-bulk', [BagController::class, 'addCustomersBulk'])
    //     ->name('groups.add-customers-bulk');
    Route::post('/bags/add-customers-bulk', [BagController::class, 'addCustomersBulk'])
        ->name('bags.add-customers-bulk');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/bags/{bag}', [BagController::class, 'show'])->name('bags.show');
});

require __DIR__ . '/auth.php';
