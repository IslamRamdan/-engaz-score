<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sponsors', function (Blueprint $table) {
            $table->id();

            // لو النظام multi-tenant
            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            // بيانات الكفيل
            $table->string('name');        // اسم الكفيل
            $table->string('address')->nullable(); // عنوان الكفيل
            $table->string('id_number')->nullable(); // رقم الهوية / السجل
            $table->string('country')->nullable();   // دولة الكفيل

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sponsors');
    }
};
