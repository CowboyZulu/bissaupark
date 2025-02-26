<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'View Dashboard',
                'slug' => 'view-dashboard',
                'description' => 'Can view the dashboard',
            ],
            [
                'name' => 'Manage Users',
                'slug' => 'manage-users',
                'description' => 'Can create, edit, and delete users',
            ],
            [
                'name' => 'Manage Roles',
                'slug' => 'manage-roles',
                'description' => 'Can create, edit, and delete roles',
            ],
            [
                'name' => 'Manage Permissions',
                'slug' => 'manage-permissions',
                'description' => 'Can create, edit, and delete permissions',
            ],
            [
                'name' => 'View Reports',
                'slug' => 'view-reports',
                'description' => 'Can view reports',
            ],
            [
                'name' => 'Export Data',
                'slug' => 'export-data',
                'description' => 'Can export data',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
} 