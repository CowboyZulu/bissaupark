<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Full access to all features',
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Can manage most features but cannot modify system settings',
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Basic user access',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
