<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. إضافة العمود كـ nullable مؤقتاً لتجنب الأخطاء إذا كان الجدول يحتوي على بيانات
        Schema::table('companies', function (Blueprint $table) {
            $table->string('token', 64)->nullable()->after('id');
        });

        // 2. توليد توكين عشوائي (حروف إنجليزية وأرقام) لكل شركة موجودة حالياً
        DB::table('companies')->whereNull('token')->cursor()->each(function ($company) {
            do {
                $token = Str::random(32); // يولد 32 حرف ورقم عشوائي (A-Z, a-z, 0-9)
            } while (DB::table('companies')->where('token', $token)->exists());

            DB::table('companies')
                ->where('id', $company->id)
                ->update(['token' => $token]);
        });

        // 3. جعل العمود إجباري وفريد (Unique) بعد ملء البيانات
        Schema::table('companies', function (Blueprint $table) {
            $table->string('token', 64)->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('token');
        });
    }
};
