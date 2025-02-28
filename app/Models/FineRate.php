<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FineRate extends Model
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
        'violation_type_id',
        'amount',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the zone that the fine rate belongs to.
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zones::class, 'zone_id');
    }

    /**
     * Get the vehicle category that the fine rate belongs to.
     */
    public function vehicleCategory(): BelongsTo
    {
        return $this->belongsTo(VehicleCategory::class);
    }

    /**
     * Get the violation type that the fine rate belongs to.
     */
    public function violationType(): BelongsTo
    {
        return $this->belongsTo(ViolationType::class);
    }
}
