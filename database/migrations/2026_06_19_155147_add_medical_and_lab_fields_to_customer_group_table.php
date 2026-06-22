<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_group', function (Blueprint $table) {
            // الكشف الطبي
            $table->enum('medical_status', ['booked', 'fit', 'unfit'])->nullable();
            $table->string('medical_token')->nullable();

            // المعامل
            $table->enum('lab_status', ['booked', 'positive', 'negative'])->nullable();

            // النت
            $table->enum('enet_status', ['booked', 'not_booked'])->nullable()->default('not_booked');
            $table->string('e_number')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('customer_group', function (Blueprint $table) {
            // حذف الحقول في حال عمل rollback
            $table->dropColumn([
                'medical_status',
                'medical_token',
                'lab_status',
                'enet_status',
                'e_number'
            ]);
        });
    }
};
