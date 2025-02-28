<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParkingRate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'zone_id',
        'vehicle_category_id',
        'rate_type',
        'amount',
        'start_time',
        'end_time',
        'is_weekend_rate',
        'is_holiday_rate',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_weekend_rate' => 'boolean',
        'is_holiday_rate' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the zone that the parking rate belongs to.
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zones::class, 'zone_id');
    }

    /**
     * Get the vehicle category that the parking rate belongs to.
     */
    public function vehicleCategory(): BelongsTo
    {
        return $this->belongsTo(VehicleCategory::class);
    }
}
