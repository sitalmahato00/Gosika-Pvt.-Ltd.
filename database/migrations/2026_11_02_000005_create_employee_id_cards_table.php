<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_id_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('card_number')->unique(); // e.g. GSK-IDC-1001-V1
            $table->string('template')->default('corporate_modern'); // corporate_modern, orange_executive, minimal_clean
            $table->date('issue_date');
            $table->date('expiry_date');
            $table->string('qr_verification_token', 64);
            $table->integer('print_count')->default(1);
            $table->string('status')->default('active'); // active, reissued, revoked
            $table->text('reissue_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_id_cards');
    }
};
