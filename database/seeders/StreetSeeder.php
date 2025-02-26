<?php

namespace Database\Seeders;

use App\Models\Street;
use App\Models\Zones;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StreetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get zones
        $downtownZone = Zones::where('code', 'DOWNTOWN')->first();
        $shoppingZone = Zones::where('code', 'SHOPPING')->first();
        $residentialZone = Zones::where('code', 'RESIDENTIAL_A')->first();
        
        // Sample streets
        $streets = [
            [
                'type' => 'main',
                'name' => 'Main Avenue',
                'zone_id' => $downtownZone?->id,
                'is_active' => true,
                'start_latitude' => 11.8636,
                'start_longitude' => -15.5977,
                'end_latitude' => 11.8700,
                'end_longitude' => -15.5900,
                'path_coordinates' => [
                    ['lat' => 11.8636, 'lng' => -15.5977],
                    ['lat' => 11.8650, 'lng' => -15.5950],
                    ['lat' => 11.8670, 'lng' => -15.5930],
                    ['lat' => 11.8700, 'lng' => -15.5900],
                ],
            ],
            [
                'type' => 'cross',
                'name' => 'Market Street',
                'zone_id' => $shoppingZone?->id,
                'is_active' => true,
                'start_latitude' => 11.8650,
                'start_longitude' => -15.5950,
                'end_latitude' => 11.8630,
                'end_longitude' => -15.5920,
                'path_coordinates' => [
                    ['lat' => 11.8650, 'lng' => -15.5950],
                    ['lat' => 11.8640, 'lng' => -15.5935],
                    ['lat' => 11.8630, 'lng' => -15.5920],
                ],
            ],
            [
                'type' => 'main',
                'name' => 'Residential Boulevard',
                'zone_id' => $residentialZone?->id,
                'is_active' => true,
                'start_latitude' => 11.8700,
                'start_longitude' => -15.5900,
                'end_latitude' => 11.8750,
                'end_longitude' => -15.5850,
                'path_coordinates' => [
                    ['lat' => 11.8700, 'lng' => -15.5900],
                    ['lat' => 11.8720, 'lng' => -15.5880],
                    ['lat' => 11.8735, 'lng' => -15.5865],
                    ['lat' => 11.8750, 'lng' => -15.5850],
                ],
            ],
            [
                'type' => 'cross',
                'name' => 'Park Lane',
                'zone_id' => $residentialZone?->id,
                'is_active' => false, // Inactive street
                'start_latitude' => 11.8720,
                'start_longitude' => -15.5880,
                'end_latitude' => 11.8700,
                'end_longitude' => -15.5860,
                'path_coordinates' => [
                    ['lat' => 11.8720, 'lng' => -15.5880],
                    ['lat' => 11.8710, 'lng' => -15.5870],
                    ['lat' => 11.8700, 'lng' => -15.5860],
                ],
            ],
        ];

        foreach ($streets as $streetData) {
            // Generate code based on street name and type
            $code = Str::upper(Str::substr($streetData['type'], 0, 1) . '-' . Str::slug($streetData['name']));
            $streetData['code'] = $code;
            
            // Create the street
            Street::create($streetData);
        }
    }
} 