<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. جدول الاستحقاقات (بدون customer_id)
        Schema::create('dues', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم الاستحقاق
            $table->decimal('amount', 12, 2); // المبلغ (يقبل موجب وسالب)
            $table->timestamps();
        });

        // 2. الجدول الوسيط للربط Many-to-Many
        Schema::create('customer_due', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('due_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_due');
        Schema::dropIfExists('dues');
    }
};
