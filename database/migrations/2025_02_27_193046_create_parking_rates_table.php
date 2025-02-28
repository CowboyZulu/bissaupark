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
        Schema::create('parking_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('zones')->onDelete('cascade');
            $table->foreignId('vehicle_category_id')->constrained('vehicle_categories')->onDelete('cascade');
            $table->enum('rate_type', ['hourly', 'daily', 'monthly']);
            $table->decimal('amount', 10, 2);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_weekend_rate')->default(false);
            $table->boolean('is_holiday_rate')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_rates');
    }
};
