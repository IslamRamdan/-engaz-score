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
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete(); // العميل
            $table->foreignId('treasury_id')->constrained()->cascadeOnDelete(); // الخزنة
            $table->foreignId('payment_method_id')->constrained()->cascadeOnDelete(); // طريقة الاستلام
            $table->decimal('debit', 12, 2)->default(0); // مدين
            $table->decimal('credit', 12, 2)->default(0); // دائن
            $table->text('description')->nullable(); // الوصف
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};
