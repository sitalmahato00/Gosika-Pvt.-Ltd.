<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('meeting_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->string('location_or_link'); // Boardroom 1, Google Meet, Zoom
            $table->text('agenda')->nullable();
            $table->text('minutes_of_meeting')->nullable();
            $table->string('status')->default('scheduled'); // scheduled, in_progress, completed, cancelled
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('meeting_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained('meetings')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('status')->default('invited'); // invited, attended, absent
            $table->timestamps();
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('priority')->default('normal'); // normal, important, urgent
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('meeting_participants');
        Schema::dropIfExists('meetings');
    }
};
