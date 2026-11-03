<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('income_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->decimal('monthly_budget', 12, 2)->default(0.00);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->string('income_number')->unique(); // e.g. GSK-INC-2026-001
            $table->string('title');
            $table->foreignId('category_id')->constrained('income_categories')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->string('payment_method')->default('bank_transfer'); // bank_transfer, cheque, cash, digital_wallet
            $table->string('payer'); // client, organization, source
            $table->string('reference_no')->nullable();
            $table->text('description')->nullable();
            $table->string('receipt_path')->nullable();
            $table->string('status')->default('completed'); // completed, pending
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('expense_number')->unique(); // e.g. GSK-EXP-2026-001
            $table->string('title');
            $table->foreignId('category_id')->constrained('expense_categories')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->string('payee'); // supplier, vendor, employee, utility
            $table->string('payment_method')->default('bank_transfer'); // bank_transfer, cheque, cash, card
            $table->string('payment_reference')->nullable();
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->string('receipt_path')->nullable();
            $table->string('status')->default('paid'); // paid, pending, void
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('incomes');
        Schema::dropIfExists('expense_categories');
        Schema::dropIfExists('income_categories');
    }
};
