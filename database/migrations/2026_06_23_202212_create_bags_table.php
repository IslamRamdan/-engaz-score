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
        Schema::create('bags', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم الحقيبة
            $table->dateTime('consulate_entry_date'); // تاريخ دخولها القنصلية (ممكن تخليه date بس لو مش محتاج الوقت)

            // الربط مع جدول الشركات
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bags');
    }
};
