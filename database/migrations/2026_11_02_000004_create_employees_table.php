<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->unique(); // e.g. GSK-EMP-1001
            $table->string('first_name');
            $table->string('last_name');
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('gender')->default('male'); // male, female, other
            $table->date('date_of_birth')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('blood_group')->nullable();
            $table->text('permanent_address')->nullable();
            $table->text('current_address')->nullable();

            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->foreignId('designation_id')->nullable()->constrained('designations')->nullOnDelete();
            $table->string('employment_type')->default('full_time'); // full_time, part_time, contract, intern
            $table->date('joining_date');
            $table->date('exit_date')->nullable();
            $table->text('exit_reason')->nullable();

            $table->decimal('basic_salary', 12, 2)->default(0.00);
            $table->string('bank_name')->nullable();
            $table->string('bank_account_no')->nullable();
            $table->string('bank_branch')->nullable();

            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relation')->nullable();

            $table->string('photo_path')->nullable();
            $table->string('status')->default('active'); // active, on_leave, resigned, terminated
            $table->string('qr_token', 64)->unique(); // secure token for verification URL without exposing personal data
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
