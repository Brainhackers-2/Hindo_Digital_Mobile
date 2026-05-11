<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

/**
 * ============================================================
 * ServiceSeeder — 5 services officiels du cahier des charges Hindo Digital
 * Réseaux, Sécurité, Dev Web/Mobile, Formation, Infographie
 * ============================================================
 */
class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::truncate();

        $services = [
            [
                'titre'       => 'Réseaux & Systèmes',
                'description' => 'Installation, configuration et maintenance de réseaux informatiques locaux et distants, adaptés à vos besoins professionnels.',
                'icone'       => 'wifi',
                'ordre'       => 1,
            ],
            [
                'titre'       => 'Sécurité & Vidéosurveillance',
                'description' => 'Mise en place de systèmes de surveillance et de protection pour sécuriser vos locaux professionnels et résidentiels.',
                'icone'       => 'shield',
                'ordre'       => 2,
            ],
            [
                'titre'       => 'Développement Web & Mobile',
                'description' => 'Création de sites web, d\'applications mobiles et de plateformes digitales sur mesure pour valoriser votre présence en ligne.',
                'icone'       => 'code',
                'ordre'       => 3,
            ],
            [
                'titre'       => 'Formation Informatique',
                'description' => 'Formations pratiques en informatique pour tous les niveaux, destinées aux particuliers, entreprises et institutions.',
                'icone'       => 'academic',
                'ordre'       => 4,
            ],
            [
                'titre'       => 'Infographie',
                'description' => 'Conception graphique et communication visuelle professionnelle pour construire et renforcer l\'identité de votre marque.',
                'icone'       => 'color',
                'ordre'       => 5,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        $this->command->info('✅ 5 services officiels Hindo Digital insérés avec succès');
    }
}
