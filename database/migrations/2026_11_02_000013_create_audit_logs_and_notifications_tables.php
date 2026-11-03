<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_name')->default('Administrator');
            $table->string('action'); // create, update, delete, login, logout, export, id_card_generate, backup
            $table->string('module'); // employees, payroll, finance, attendance, assets, settings, etc.
            $table->unsignedBigInteger('record_id')->nullable();
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('details')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('system'); // meeting, leave, task, inventory, warranty, payroll, document
            $table->string('title');
            $table->text('message');
            $table->string('link')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('audit_logs');
    }
};
