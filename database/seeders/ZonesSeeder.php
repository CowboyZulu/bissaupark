<?php

namespace Database\Seeders;

use App\Models\Zones;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ZonesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $zones = [
            [
                'name' => 'Downtown Core',
                'code' => 'DOWNTOWN',
                'is_active' => true,
            ],
            [
                'name' => 'Shopping District',
                'code' => 'SHOPPING',
                'is_active' => true,
            ],
            [
                'name' => 'Residential Zone A',
                'code' => 'RESIDENTIAL_A',
                'is_active' => true,
            ],
            [
                'name' => 'Hospital Zone',
                'code' => 'HOSPITAL',
                'is_active' => true,
            ],
            [
                'name' => 'School Zone',
                'code' => 'SCHOOL',
                'is_active' => true,
            ],
            [
                'name' => 'Industrial Park',
                'code' => 'INDUSTRIAL',
                'is_active' => true,
            ],
        ];

        foreach ($zones as $zone) {
            Zones::create($zone);
        }
    }
}
