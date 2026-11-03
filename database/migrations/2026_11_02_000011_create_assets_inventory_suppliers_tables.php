<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique(); // e.g. GSK-SPL-01
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('tax_number')->nullable();
            $table->text('products_or_services')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });

        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code')->unique(); // e.g. GSK-AST-1001
            $table->string('name');
            $table->string('category'); // IT Equipment, Office Furniture, Vehicles, Electronics
            $table->string('serial_number')->nullable();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_cost', 12, 2)->default(0.00);
            $table->date('warranty_expiry')->nullable();
            $table->string('condition')->default('good'); // new, good, fair, needs_repair, disposed
            $table->foreignId('assigned_employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('status')->default('in_use'); // in_use, available, under_maintenance, retired
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('asset_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->onDelete('cascade');
            $table->date('maintenance_date');
            $table->decimal('cost', 12, 2)->default(0.00);
            $table->text('description');
            $table->string('service_provider')->nullable();
            $table->date('next_service_date')->nullable();
            $table->string('status')->default('completed'); // scheduled, in_progress, completed
            $table->timestamps();
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_code')->unique(); // e.g. GSK-INV-101
            $table->string('name');
            $table->string('category'); // Stationery, Electronics, Pantry, Cleaning, Packaging
            $table->integer('quantity')->default(0);
            $table->string('unit')->default('pcs'); // pcs, box, ream, pack, kg
            $table->integer('min_stock_threshold')->default(5);
            $table->decimal('unit_price', 10, 2)->default(0.00);
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->string('location')->nullable(); // Storage Room A, Floor 2 Pantry, etc.
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->string('type'); // in (purchase/restock), out (used/disbursed), adjustment
            $table->integer('quantity');
            $table->integer('balance_after');
            $table->date('date');
            $table->string('reference_no')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('logged_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('asset_maintenances');
        Schema::dropIfExists('assets');
        Schema::dropIfExists('suppliers');
    }
};
