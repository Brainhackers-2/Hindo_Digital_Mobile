<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inscription;
use App\Models\Formation;

/**
 * ============================================================
 * InscriptionSeeder — Données de démonstration pour les inscriptions
 * Crée quelques inscriptions exemples pour tester l'application
 * ============================================================
 */
class InscriptionSeeder extends Seeder
{
    public function run(): void
    {
        Inscription::truncate();

        // Récupère les IDs des formations existantes
        $formationIds = Formation::pluck('id')->toArray();

        if (empty($formationIds)) {
            $this->command->warn('⚠️ Aucune formation trouvée — inscriptions non créées.');
            return;
        }

        $inscriptions = [
            ['nom' => 'Mamadou Diallo',   'email' => 'mamadou@example.com', 'telephone' => '+221771234567', 'formation_id' => $formationIds[0]],
            ['nom' => 'Fatou Mbaye',      'email' => 'fatou@example.com',   'telephone' => '+221781234567', 'formation_id' => $formationIds[1] ?? $formationIds[0]],
            ['nom' => 'Ibrahima Sow',     'email' => 'ibrahima@example.com','telephone' => '+221701234567', 'formation_id' => $formationIds[2] ?? $formationIds[0]],
        ];

        foreach ($inscriptions as $inscription) {
            Inscription::create($inscription);
        }

        $this->command->info('✅ Inscriptions insérées (' . count($inscriptions) . ')');
    }
}
