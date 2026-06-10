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
        Schema::create('customers', function (Blueprint $table) {

            $table->id();

            // الشركة والموظف
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            // البيانات الأساسية
            $table->string('name_ar');
            $table->string('name_en')->nullable();

            $table->enum('gender', ['male', 'female'])->nullable();

            $table->date('birth_date')->nullable();

            $table->string('nationality')->nullable();

            $table->string('marital_status')->nullable();

            // التواصل
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();

            // العنوان
            $table->string('governorate')->nullable();
            $table->text('address')->nullable();

            // الجواز
            $table->string('passport_number')->nullable()->index();
            $table->date('passport_issue_date')->nullable();
            $table->date('passport_expiry_date')->nullable();
            $table->string('passport_issue_place')->nullable();

            $table->text('mrz')->nullable();

            $table->string('passport_image')->nullable();

            // الصورة الشخصية
            $table->string('personal_image')->nullable();

            // بيانات التأشيرة
            $table->string('visa_number')->nullable()->index();
            $table->string('e_number')->nullable()->index();

            // الكشف الطبي
            $table->enum('medical_status', [
                'booked',
                'fit',
                'unfit'
            ])->default('booked');

            $table->string('medical_token')->nullable();

            // المعامل
            $table->enum('lab_status', [
                'booked',
                'positive',
                'negative'
            ])->default('booked');

            // النت
            $table->enum('enet_status', [
                'booked',
                'not_booked'
            ])->default('not_booked');

            // ملاحظات
            $table->longText('notes')->nullable();

            $table->string('national_id')->nullable();

            $table->string('national_id_image')->nullable();

            $table->string('job_proof_image')->nullable();

            $table->softDeletes();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
