<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delegates', function (Blueprint $table) {
            $table->id();

            // ربط بالشركة (Multi-tenant)
            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            // بيانات المندوب
            $table->string('name');   // اسم المندوب
            $table->string('phone');  // رقم الهاتف

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delegates');
    }
};
