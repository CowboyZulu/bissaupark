<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class ZonesPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the zones permission if it doesn't exist
        $permission = Permission::firstOrCreate(
            ['slug' => 'manage-zones'],
            [
                'name' => 'Manage Zones',
                'description' => 'Can create, edit, and delete zones',
            ]
        );

        // Assign the permission to the admin role
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole && !$adminRole->permissions()->where('permissions.id', $permission->id)->exists()) {
            $adminRole->permissions()->attach($permission->id);
        }
    }
} 