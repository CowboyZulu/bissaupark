<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParkingSpace extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'street_id',
        'space_number',
        'type',
        'latitude',
        'longitude',
        'is_handicap',
        'is_loading_zone',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_handicap' => 'boolean',
        'is_loading_zone' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the street that the parking space belongs to.
     */
    public function street(): BelongsTo
    {
        return $this->belongsTo(Street::class);
    }
}
