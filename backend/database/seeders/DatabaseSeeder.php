<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ============================================================
 * DatabaseSeeder — Seeder principal orchestrant tous les seeders
 * Exécuter avec : php artisan db:seed
 * ============================================================
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Peuple la base de données avec des données de démonstration.
     * Les FK checks sont désactivés le temps de l'insertion.
     */
    public function run(): void
    {
        // Désactive les contraintes FK pour permettre le truncate sans erreur
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->call([
            ServiceSeeder::class,
            RealisationSeeder::class,
            FormationSeeder::class,
            InscriptionSeeder::class,
            TemoignageSeeder::class,
        ]);

        // Réactive les contraintes FK
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
