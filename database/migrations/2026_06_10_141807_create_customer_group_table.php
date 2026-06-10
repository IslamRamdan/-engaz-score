<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_group', function (Blueprint $table) {
            $table->id();
            // ربط جدول العملاء
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            // ربط جدول المجموعات
            $table->foreignId('group_id')->constrained('groups')->cascadeOnDelete();

            // إضافة unique لضمان عدم تكرار إضافة نفس العميل في نفس المجموعة
            $table->unique(['customer_id', 'group_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_group');
    }
};
