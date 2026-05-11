<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Temoignage;

/**
 * ============================================================
 * TemoignageSeeder — Données de démonstration pour les témoignages
 * Peuple la table avec des avis clients réalistes
 * ============================================================
 */
class TemoignageSeeder extends Seeder
{
    public function run(): void
    {
        Temoignage::truncate();

        $temoignages = [
            [
                'nom'   => 'Mamadou Diallo',
                'poste' => 'Directeur, PME Ziguinchor',
                'texte' => 'Hindo Digital a complètement transformé notre infrastructure réseau. L\'équipe est professionnelle, ponctuelle et les résultats dépassent nos attentes. Je recommande vivement !',
                'note'  => 5,
                'actif' => true,
            ],
            [
                'nom'   => 'Fatou Mbaye',
                'poste' => 'Gérante, Boutique Élégance',
                'texte' => 'Notre site e-commerce a été livré dans les délais avec une qualité remarquable. Les ventes ont augmenté de 40% depuis le lancement. Merci Hindo Digital !',
                'note'  => 5,
                'actif' => true,
            ],
            [
                'nom'   => 'Ibrahima Sow',
                'poste' => 'Responsable IT, ONG Ziguinchor',
                'texte' => 'Les formations dispensées par Hindo Digital ont considérablement boosté les compétences numériques de mon équipe. Formateurs très pédagogues et disponibles.',
                'note'  => 5,
                'actif' => true,
            ],
            [
                'nom'   => 'Aminata Diop',
                'poste' => 'Directrice, École privée',
                'texte' => 'L\'installation de notre système de vidéosurveillance s\'est déroulée sans accroc. La sécurité de notre établissement est maintenant assurée. Service impeccable.',
                'note'  => 5,
                'actif' => true,
            ],
            [
                'nom'   => 'Ousmane Ndiaye',
                'poste' => 'Entrepreneur, Ziguinchor',
                'texte' => 'Hindo Digital a créé notre identité visuelle complète : logo, flyers, site web. Tout est cohérent et professionnel. Nous avons trouvé notre partenaire numérique !',
                'note'  => 4,
                'actif' => true,
            ],
            [
                'nom'   => 'Rokhaya Fall',
                'poste' => 'Comptable, Cabinet Thiès',
                'texte' => 'La formation bureautique m\'a permis de maîtriser Excel avancé et d\'automatiser mes reportings. Gain de temps considérable au quotidien. Formation très pratique.',
                'note'  => 5,
                'actif' => true,
            ],
        ];

        foreach ($temoignages as $temoignage) {
            Temoignage::create($temoignage);
        }

        $this->command->info('✅ Témoignages insérés (' . count($temoignages) . ')');
    }
}
