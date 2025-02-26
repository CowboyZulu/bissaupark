<?php

namespace Database\Seeders;

use App\Models\VehicleCategory;
use Illuminate\Database\Seeder;

class VehicleCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Sedan',
                'description' => 'A standard passenger car with a separate trunk',
            ],
            [
                'name' => 'SUV',
                'description' => 'Sport Utility Vehicle with higher ground clearance',
            ],
            [
                'name' => 'Truck',
                'description' => 'Vehicle designed for transporting cargo',
            ],
            [
                'name' => 'Van',
                'description' => 'Vehicle for transporting people or goods',
            ],
            [
                'name' => 'Motorcycle',
                'description' => 'Two-wheeled motor vehicle',
            ],
            [
                'name' => 'Bus',
                'description' => 'Large vehicle for passenger transport',
            ],
        ];

        foreach ($categories as $category) {
            VehicleCategory::create($category);
        }
    }
} 