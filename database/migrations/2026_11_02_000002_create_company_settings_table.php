<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default('GOSIKA Pvt. Ltd.');
            $table->string('trading_name')->default('GOSIKA');
            $table->string('registration_no')->nullable()->default('REG-284910/080/081');
            $table->string('pan_vat_no')->nullable()->default('612093845');
            $table->string('email')->default('office@gosika.com');
            $table->string('phone')->default('+977-1-4567890');
            $table->string('website')->default('https://gosika.com');
            $table->string('address')->nullable()->default('Corporate Tower, Tinkune');
            $table->string('city')->default('Kathmandu');
            $table->string('country')->default('Nepal');
            $table->string('default_currency')->default('NPR');
            $table->string('currency_symbol')->default('रू');
            $table->string('date_format')->default('Y-m-d');
            $table->string('fiscal_year')->default('2081/2082');
            $table->string('logo_path')->nullable();
            $table->string('stamp_signature_path')->nullable();
            $table->string('id_card_template')->default('corporate_modern');
            $table->integer('attendance_grace_minutes')->default(15);
            $table->integer('annual_leave_quota')->default(18);
            $table->decimal('default_tax_rate', 5, 2)->default(1.00); // 1% initial TDS for employment income base
            $table->decimal('default_provident_fund_rate', 5, 2)->default(10.00); // 10% standard PF
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};
