<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Street extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'name',
        'code',
        'zone_id',
        'is_active',
        'start_latitude',
        'end_latitude',
        'start_longitude',
        'end_longitude',
        'path_coordinates',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'start_latitude' => 'decimal:7',
        'end_latitude' => 'decimal:7',
        'start_longitude' => 'decimal:7',
        'end_longitude' => 'decimal:7',
        'path_coordinates' => 'array',
    ];

    /**
     * Get the zone that the street belongs to.
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zones::class, 'zone_id');
    }

    /**
     * Get the parking spaces for the street.
     */
    public function parkingSpaces(): HasMany
    {
        return $this->hasMany(ParkingSpace::class);
    }
}
