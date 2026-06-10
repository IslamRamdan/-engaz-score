<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visas', function (Blueprint $table) {
            $table->id();

            // Multi-tenant
            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            // بيانات التأشيرة
            $table->string('name'); // اسم التأشيرة

            $table->enum('type', [
                'work_temp_hajj_umrah', // تأشيرة العمل المؤقت للحج والعمرة
                'work',                 // عمل
                'temporary_work'        // عمل مؤقت
            ]);

            $table->string('issue_number')->nullable(); // الرقم الصادر

            $table->string('consulate')->nullable(); // القنصلية

            // ربط الكفيل
            $table->foreignId('sponsor_id')
                ->constrained('sponsors')
                ->cascadeOnDelete();

            // تاريخ إصدار هجري (نخزنه كنص)
            $table->string('issue_date_hijri')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visas');
    }
};
