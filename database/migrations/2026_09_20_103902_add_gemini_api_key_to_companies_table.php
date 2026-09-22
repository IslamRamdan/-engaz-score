<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // استخدام text للحسابات التي تشفر المفتاح مفضّل لأن النص المشفر يكون طويلاً
            $table->text('gemini_api_key')->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('gemini_api_key');
        });
    }
};
