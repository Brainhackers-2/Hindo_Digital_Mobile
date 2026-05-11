<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation;

/**
 * ============================================================
 * FormationSeeder — Données de démonstration pour les formations
 * Peuple le catalogue de formations de Hindo Digital
 * ============================================================
 */
class FormationSeeder extends Seeder
{
    public function run(): void
    {
        Formation::truncate();

        $formations = [
            ['titre' => 'Bureautique complète',         'description' => 'Maîtrisez Word, Excel, PowerPoint et les outils collaboratifs Google Workspace. Formation adaptée aux débutants souhaitant gagner en productivité.',        'duree' => '2 semaines', 'niveau' => 'Débutant',      'prix' => 25000],
            ['titre' => 'Développement Web Front-End',  'description' => 'Apprenez HTML, CSS et JavaScript pour créer des pages web modernes et responsives. Projets pratiques inclus.',                                              'duree' => '4 semaines', 'niveau' => 'Intermédiaire', 'prix' => 75000],
            ['titre' => 'Réseaux informatiques',        'description' => 'Bases du networking : modèle OSI, TCP/IP, VLAN, routage. Configuration de routeurs Cisco et switches en travaux pratiques.',                              'duree' => '3 semaines', 'niveau' => 'Intermédiaire', 'prix' => 60000],
            ['titre' => 'Administration système Linux', 'description' => 'Maîtrisez l\'administration d\'un serveur Linux : installation, gestion des services, sécurité, scripting bash et automatisation des tâches.',            'duree' => '4 semaines', 'niveau' => 'Avancé',        'prix' => 80000],
            ['titre' => 'Design graphique avec Photoshop', 'description' => 'Retouche photo professionnelle, création d\'affiches, bannières et supports visuels. Formation axée sur des projets créatifs réels.',                 'duree' => '2 semaines', 'niveau' => 'Débutant',      'prix' => 35000],
            ['titre' => 'Cybersécurité & Protection',   'description' => 'Principes fondamentaux de la sécurité informatique : menaces actuelles, protection des données, pare-feu, VPN et bonnes pratiques.',                     'duree' => '3 semaines', 'niveau' => 'Avancé',        'prix' => 90000],
        ];

        foreach ($formations as $formation) {
            Formation::create($formation);
        }

        $this->command->info('✅ Formations insérées (' . count($formations) . ')');
    }
}
