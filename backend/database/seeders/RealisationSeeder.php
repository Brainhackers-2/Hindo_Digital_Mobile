<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Realisation;

/**
 * ============================================================
 * RealisationSeeder — Données de démonstration pour les réalisations
 * Peuple la galerie de projets avec des exemples représentatifs
 * ============================================================
 */
class RealisationSeeder extends Seeder
{
    public function run(): void
    {
        Realisation::truncate();

        $realisations = [
            ['titre' => 'Infrastructure réseau PME 30 postes',   'categorie' => 'Réseaux',          'description' => 'Conception et déploiement d\'un réseau local pour une PME, incluant câblage, switch et bornes Wi-Fi.'],
            ['titre' => 'Vidéosurveillance entrepôt logistique', 'categorie' => 'Vidéosurveillance', 'description' => 'Installation de 12 caméras IP HD avec enregistrement sur NVR et accès à distance.'],
            ['titre' => 'Site e-commerce boutique de mode',      'categorie' => 'Web & Mobile',      'description' => 'Développement d\'une boutique en ligne avec paiement Orange Money et livraison à domicile.'],
            ['titre' => 'Application mobile de livraison',       'categorie' => 'Web & Mobile',      'description' => 'App Android/iOS de gestion de livraisons en temps réel avec carte interactive.'],
            ['titre' => 'Formation bureautique 20 agents',       'categorie' => 'Formation',         'description' => 'Programme de formation Office pour 20 employés d\'une administration publique.'],
            ['titre' => 'Identité visuelle restaurant "Le Teranga"', 'categorie' => 'Infographie',  'description' => 'Création du logo, menus, flyers et kakémonos pour un restaurant de cuisine sénégalaise.'],
            ['titre' => 'Wi-Fi campus universitaire',            'categorie' => 'Réseaux',          'description' => 'Déploiement de 30 points d\'accès Wi-Fi couvrant 5 bâtiments universitaires.'],
            ['titre' => 'Application RH pour ONG',              'categorie' => 'Web & Mobile',      'description' => 'Système web de gestion des ressources humaines : congés, paie et évaluations.'],
            ['titre' => 'Charte graphique startup fintech',      'categorie' => 'Infographie',       'description' => 'Élaboration de l\'identité visuelle complète d\'une startup de paiement mobile.'],
        ];

        foreach ($realisations as $r) {
            Realisation::create(array_merge($r, ['image_path' => null]));
        }

        $this->command->info('✅ Réalisations insérées (' . count($realisations) . ')');
    }
}
