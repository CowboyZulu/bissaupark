<?php

namespace Database\Seeders;

use App\Models\ViolationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ViolationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $violationTypes = [
            [
                'name' => 'No Parking',
                'code' => 'NO_PARKING',
                'is_active' => true,
            ],
            [
                'name' => 'Expired Meter',
                'code' => 'EXPIRED_METER',
                'is_active' => true,
            ],
            [
                'name' => 'Double Parking',
                'code' => 'DOUBLE_PARKING',
                'is_active' => true,
            ],
            [
                'name' => 'Handicap Zone',
                'code' => 'HANDICAP_ZONE',
                'is_active' => true,
            ],
            [
                'name' => 'Fire Hydrant',
                'code' => 'FIRE_HYDRANT',
                'is_active' => true,
            ],
            [
                'name' => 'Loading Zone',
                'code' => 'LOADING_ZONE',
                'is_active' => true,
            ],
            [
                'name' => 'Bus Stop',
                'code' => 'BUS_STOP',
                'is_active' => true,
            ],
        ];

        foreach ($violationTypes as $violationType) {
            ViolationType::create($violationType);
        }
    }
}
