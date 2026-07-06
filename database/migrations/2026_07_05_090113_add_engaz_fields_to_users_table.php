<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // إضافة الحقول الجديدة بعد حقل الباسورد الحالي
            $table->string('engaz_email')->nullable()->after('password');

            // حقل النص العادي (ستخزن فيه الباسورد كـ Plain Text من الـ Controller)
            $table->string('engaz_password')->nullable()->after('engaz_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
