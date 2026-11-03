<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminPassword = config('app.admin.password');

        if (!is_string($adminPassword) || strlen($adminPassword) < 12) {
            throw new RuntimeException('Set an ADMIN_PASSWORD of at least 12 characters before running database seeding.');
        }

        User::updateOrCreate(
            ['email' => config('app.admin.email')],
            [
                'name' => config('app.admin.name'),
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'status' => 'active',
            ]
        );
    }
}
