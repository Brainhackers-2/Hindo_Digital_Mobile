<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/**
 * ============================================================
 * AdminUserSeeder — Compte administrateur Hindo Digital
 *
 * Identifiants (lire depuis les variables d'environnement en prod)
 *   Email    : ADMIN_EMAIL    (défaut: admin@hindodigital.sn)
 *   Password : ADMIN_PASSWORD (défaut: HindoAdmin2024!)
 * ============================================================
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email    = env('ADMIN_EMAIL',    'admin@hindodigital.sn');
        $password = env('ADMIN_PASSWORD', 'HindoAdmin2024!');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name'     => 'Admin Hindo Digital',
                'email'    => $email,
                'password' => Hash::make($password),
            ]
        );

        $this->command->info("✅ Compte admin créé : {$email}");
    }
}
