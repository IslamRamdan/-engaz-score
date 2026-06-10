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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();

            // Multi-tenant (الشركة والموظف اللي عمل المجموعة)
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();

            // بيانات المجموعة
            $table->string('name'); // اسم المجموعة

            // ربط المجموعة بالتأشيرة (كل مجموعة لها تأشيرة واحدة فقط)
            $table->foreignId('visa_id')->constrained('visas')->cascadeOnDelete();

            // ملاحظات إضافية للمجموعة
            $table->text('notes')->nullable();

            $table->softDeletes(); // متناسق مع جدول العملاء لو حبيت تفعل الحذف المؤقت
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
