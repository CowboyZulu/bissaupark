<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\VehicleCategorySeeder;
use Database\Seeders\ViolationTypeSeeder;
use Database\Seeders\ZonesSeeder;
use Database\Seeders\ZonesPermissionSeeder;
use Database\Seeders\StreetSeeder;
use Database\Seeders\ParkingSpaceSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            VehicleCategorySeeder::class,
            ViolationTypeSeeder::class,
            ZonesSeeder::class,
            ZonesPermissionSeeder::class,
            StreetSeeder::class,
            ParkingSpaceSeeder::class,
        ]);

        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
