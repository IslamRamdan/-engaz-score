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
        Schema::create('bag_customer', function (Blueprint $table) {
            $table->id();

            // الربط مع جدول الحقائب
            $table->foreignId('bag_id')->constrained()->cascadeOnDelete();

            // الربط مع جدول العملاء
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

            // لمنع تكرار نفس العميل داخل نفس الحقيبة
            $table->unique(['bag_id', 'customer_id']);

            $table->timestamps(); // اختياري، شيله لو مش محتاج تواريخ الربط
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bag_customer');
    }
};
