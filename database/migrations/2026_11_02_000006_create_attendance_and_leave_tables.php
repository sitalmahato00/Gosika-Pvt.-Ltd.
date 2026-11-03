<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days')->default(1);
            $table->string('type')->default('public'); // public, company, festival
            $table->text('description')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('date');
            $table->time('clock_in')->nullable();
            $table->time('clock_out')->nullable();
            $table->decimal('total_hours', 4, 2)->default(0.00);
            $table->string('status')->default('present'); // present, absent, late, half_day, holiday, on_leave
            $table->text('notes')->nullable();
            $table->boolean('is_corrected')->default(false);
            $table->foreignId('corrected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['employee_id', 'date']);
        });

        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Annual, Casual, Sick, Maternity, Paternity, Unpaid
            $table->string('code')->unique();
            $table->integer('max_days_per_year')->default(12);
            $table->boolean('is_paid')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained('leave_types')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_days', 4, 1)->default(1.0);
            $table->text('reason');
            $table->string('attachment_path')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('admin_remarks')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('leave_types');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('holidays');
    }
};
