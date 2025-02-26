<?php

namespace Database\Seeders;

use App\Models\ParkingSpace;
use App\Models\Street;
use Illuminate\Database\Seeder;

class ParkingSpaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all active streets
        $streets = Street::where('is_active', true)->get();

        foreach ($streets as $street) {
            // Skip if street has no path coordinates
            if (empty($street->path_coordinates)) {
                $this->command->info("Skipping street {$street->name} - No path coordinates");
                continue;
            }

            // Parse path coordinates
            $pathCoordinates = $street->path_coordinates;
            if (is_string($pathCoordinates)) {
                $pathCoordinates = json_decode($pathCoordinates, true);
            }
            
            // Skip if no valid coordinates
            if (empty($pathCoordinates) || !is_array($pathCoordinates)) {
                $this->command->info("Skipping street {$street->name} - Invalid path coordinates format");
                continue;
            }

            $this->command->info("Processing street: {$street->name} with " . count($pathCoordinates) . " coordinates");
            
            // Determine number of parking spaces based on street length
            $numSpaces = min(count($pathCoordinates), 5); // Maximum 5 spaces per street
            
            // Generate parking spaces along the street
            for ($i = 0; $i < $numSpaces; $i++) {
                // Get a point along the street
                $pointIndex = (int) (($i / $numSpaces) * (count($pathCoordinates) - 1));
                $point = $pathCoordinates[$pointIndex];
                
                // Debug the point structure
                $this->command->info("Point at index {$pointIndex}: " . json_encode($point));
                
                // Extract latitude and longitude based on the structure
                $latitude = null;
                $longitude = null;
                
                if (is_array($point) && isset($point[0]) && isset($point[1])) {
                    // Format: [lat, lng]
                    $latitude = $point[0];
                    $longitude = $point[1];
                } elseif (is_object($point) && isset($point->lat) && isset($point->lng)) {
                    // Format: {lat: x, lng: y}
                    $latitude = $point->lat;
                    $longitude = $point->lng;
                } elseif (is_array($point) && isset($point['lat']) && isset($point['lng'])) {
                    // Format: {lat: x, lng: y} as array
                    $latitude = $point['lat'];
                    $longitude = $point['lng'];
                }
                
                if ($latitude === null || $longitude === null) {
                    $this->command->error("Invalid point format for street {$street->name} at index {$pointIndex}");
                    continue;
                }
                
                // Add a small random offset to avoid all spaces being exactly on the street line
                $latOffset = (mt_rand(-10, 10) / 10000); // Small random offset
                $lngOffset = (mt_rand(-10, 10) / 10000); // Small random offset
                
                // Determine parking type based on street type
                $parkingType = $this->getParkingTypeForStreet($street->type);
                
                // Create space number
                $spaceNumber = $street->code . '-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT);
                
                // Randomly determine if it's a special space
                $isHandicap = mt_rand(1, 10) === 1; // 10% chance
                $isLoadingZone = !$isHandicap && mt_rand(1, 10) === 1; // 10% chance if not handicap
                
                // Create the parking space
                ParkingSpace::create([
                    'street_id' => $street->id,
                    'space_number' => $spaceNumber,
                    'type' => $parkingType,
                    'latitude' => $latitude + $latOffset,
                    'longitude' => $longitude + $lngOffset,
                    'is_handicap' => $isHandicap,
                    'is_loading_zone' => $isLoadingZone,
                    'is_active' => true,
                ]);
                
                $this->command->info("Created parking space {$spaceNumber} at {$latitude}, {$longitude}");
            }
        }
    }
    
    /**
     * Determine appropriate parking type based on street type
     */
    private function getParkingTypeForStreet(string $streetType): string
    {
        switch ($streetType) {
            case 'avenue':
            case 'boulevard':
                return mt_rand(1, 2) === 1 ? 'parallel' : 'angled';
            case 'street':
                return mt_rand(1, 3) <= 2 ? 'parallel' : 'perpendicular'; // 2/3 chance of parallel
            case 'lane':
            case 'alley':
                return 'parallel'; // Narrow streets only get parallel parking
            default:
                $types = ['parallel', 'perpendicular', 'angled'];
                return $types[array_rand($types)];
        }
    }
} 