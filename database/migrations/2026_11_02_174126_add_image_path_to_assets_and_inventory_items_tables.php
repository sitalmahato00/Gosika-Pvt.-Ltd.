<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('condition');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }
};
