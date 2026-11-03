<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. GSK-PRJ-01
            $table->string('name');
            $table->string('client_name')->nullable();
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('budget', 12, 2)->default(0.00);
            $table->string('status')->default('active'); // planning, active, on_hold, completed, cancelled
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->integer('progress_percentage')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('due_date');
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->string('status')->default('todo'); // todo, in_progress, review, completed
            $table->integer('progress_percentage')->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('projects');
    }
};
