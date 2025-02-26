<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('streets', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['main', 'cross'])->comment('Main or cross street');
            $table->string('name');
            $table->string('code')->unique();
            $table->foreignId('zone_id')->nullable()->constrained('zones')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->decimal('start_latitude', 10, 7)->nullable();
            $table->decimal('end_latitude', 10, 7)->nullable();
            $table->decimal('start_longitude', 10, 7)->nullable();
            $table->decimal('end_longitude', 10, 7)->nullable();
            $table->json('path_coordinates')->nullable()->comment('JSON array of coordinates for the street path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('streets');
    }
};
