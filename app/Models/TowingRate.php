<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowingRate extends Model
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
        'service_fee',
        'fine_amount',
        'daily_storage_fee',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'service_fee' => 'decimal:2',
        'fine_amount' => 'decimal:2',
        'daily_storage_fee' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the zone that the towing rate belongs to.
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zones::class, 'zone_id');
    }

    /**
     * Get the vehicle category that the towing rate belongs to.
     */
    public function vehicleCategory(): BelongsTo
    {
        return $this->belongsTo(VehicleCategory::class);
    }
}
