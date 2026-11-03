<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->integer('month'); // 1 - 12
            $table->integer('year');  // e.g. 2026
            $table->string('salary_period'); // e.g. "November 2026"
            $table->string('slip_number')->unique(); // e.g. GSK-SLP-2026-11-1001

            $table->decimal('basic_salary', 12, 2)->default(0.00);
            $table->decimal('allowances', 12, 2)->default(0.00);
            $table->decimal('bonuses', 12, 2)->default(0.00);
            $table->decimal('gross_salary', 12, 2)->default(0.00);

            $table->decimal('tax_deduction', 12, 2)->default(0.00);
            $table->decimal('provident_fund', 12, 2)->default(0.00);
            $table->decimal('other_deductions', 12, 2)->default(0.00);
            $table->decimal('total_deductions', 12, 2)->default(0.00);

            $table->decimal('net_salary', 12, 2)->default(0.00);

            $table->date('payment_date')->nullable();
            $table->string('payment_method')->default('bank_transfer'); // bank_transfer, cheque, cash
            $table->string('payment_reference')->nullable();
            $table->string('status')->default('paid'); // pending, paid, cancelled
            $table->text('notes')->nullable();

            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['employee_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
