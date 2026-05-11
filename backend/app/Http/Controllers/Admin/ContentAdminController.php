<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * Admin\ContentAdminController — CMS : gestion de tout le contenu
 * Lit et sauvegarde le contenu de toutes les pages via la table settings
 * Chaque clé correspond à un texte modifiable du site
 * ============================================================
 */
class ContentAdminController extends Controller
{
    /**
     * Retourne tout le contenu actuel du site (valeurs en base ou par défaut)
     * GET /api/v1/admin/contenu
     */
    public function index(): JsonResponse
    {
        $contenu = $this->toutLeContenu();
        return response()->json(['success' => true, 'data' => $contenu]);
    }

    /**
     * Sauvegarde un groupe de clés en une seule requête (batch update)
     * POST /api/v1/admin/contenu
     */
    public function sauvegarder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'contenu' => ['required', 'array'],
        ]);

        // Sauvegarde chaque clé/valeur dans la table settings
        foreach ($data['contenu'] as $key => $value) {
            // Sécurité : seules les clés connues sont acceptées
            if (array_key_exists($key, $this->toutLeContenu())) {
                Setting::set($key, $value);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Contenu mis à jour avec succès.',
        ]);
    }

    /**
     * Toutes les clés de contenu du site avec leurs valeurs par défaut.
     * Utilisé à la fois pour lire et pour valider les clés acceptées.
     */
    private function toutLeContenu(): array
    {
        return [
            // ---- INFORMATIONS GÉNÉRALES ----
            'general_nom'           => Setting::get('general_nom',           'Hindo Digital'),
            'general_slogan'        => Setting::get('general_slogan',        'Le Numérique à votre porte'),
            'general_adresse'       => Setting::get('general_adresse',       'Ziguinchor, Sénégal'),
            'general_email'         => Setting::get('general_email',         'hindodigitale@gmail.com'),
            'general_tel1'          => Setting::get('general_tel1',          '+221 76 404 37 44'),
            'general_tel2'          => Setting::get('general_tel2',          '+221 78 849 43 63'),
            'general_tel3'          => Setting::get('general_tel3',          '+221 78 121 85 95'),
            'general_site'          => Setting::get('general_site',          'hindodigitale.com'),
            'general_facebook'      => Setting::get('general_facebook',      'https://facebook.com/hindodigitale'),
            'general_whatsapp'      => Setting::get('general_whatsapp',      'https://wa.me/221764043744'),
            'general_linkedin'      => Setting::get('general_linkedin',      'https://linkedin.com/company/hindodigital'),
            'general_instagram'     => Setting::get('general_instagram',     'https://instagram.com/hindodigitale'),

            // ---- PAGE ACCUEIL ----
            'hero_badge'            => Setting::get('hero_badge',            'Entreprise numérique sénégalaise — Ziguinchor'),
            'hero_titre'            => Setting::get('hero_titre',            'Hindo Digital'),
            'hero_slogan'           => Setting::get('hero_slogan',           'Le Numérique à votre porte'),
            'hero_sous_titre'       => Setting::get('hero_sous_titre',       'Réseaux, vidéosurveillance, développement web & mobile, formation informatique et infographie — des solutions numériques complètes pour les entreprises et particuliers.'),
            'hero_cta_principal'    => Setting::get('hero_cta_principal',    'Consultation gratuite'),
            'hero_cta_secondaire'   => Setting::get('hero_cta_secondaire',   'Nos services'),

            // Chiffres clés
            'stat1_valeur'          => Setting::get('stat1_valeur', '50+'),
            'stat1_label'           => Setting::get('stat1_label',  'Clients satisfaits'),
            'stat2_valeur'          => Setting::get('stat2_valeur', '80+'),
            'stat2_label'           => Setting::get('stat2_label',  'Projets réalisés'),
            'stat3_valeur'          => Setting::get('stat3_valeur', '5+'),
            'stat3_label'           => Setting::get('stat3_label',  'Années d\'expérience'),
            'stat4_valeur'          => Setting::get('stat4_valeur', '24/7'),
            'stat4_label'           => Setting::get('stat4_label',  'Support disponible'),

            // Arguments "Pourquoi nous choisir"
            'arg1_titre'            => Setting::get('arg1_titre', 'Expertise technique'),
            'arg1_texte'            => Setting::get('arg1_texte', 'Couvrant tous les domaines IT : réseaux, sécurité, développement, formation et design.'),
            'arg2_titre'            => Setting::get('arg2_titre', 'Solutions sur mesure'),
            'arg2_texte'            => Setting::get('arg2_texte', 'Adaptées aux besoins des entreprises, institutions et particuliers.'),
            'arg3_titre'            => Setting::get('arg3_titre', 'Support 24/7'),
            'arg3_texte'            => Setting::get('arg3_texte', 'Maintenance proactive et assistance technique disponible en permanence.'),
            'arg4_titre'            => Setting::get('arg4_titre', 'Approche pédagogique'),
            'arg4_texte'            => Setting::get('arg4_texte', 'Pour l\'autonomisation de nos clients — nous vous formons à maîtriser vos outils.'),

            // CTA final
            'accueil_cta_titre'     => Setting::get('accueil_cta_titre',  'Prêt à passer au numérique ?'),
            'accueil_cta_texte'     => Setting::get('accueil_cta_texte',  'Contactez-nous dès aujourd\'hui et découvrez comment Hindo Digital peut transformer votre activité.'),

            // ---- PAGE À PROPOS ----
            'apropos_intro1'        => Setting::get('apropos_intro1',   'Hindo Digital est une startup sénégalaise spécialisée dans les services numériques, offrant des solutions innovantes en réseaux informatiques, sécurité, développement web et mobile, ainsi que formation en informatique.'),
            'apropos_intro2'        => Setting::get('apropos_intro2',   'Inspirée du mot "Hindo", qui signifie résidence ou lieu d\'origine, l\'entreprise met un point d\'honneur à rapprocher la technologie des populations en proposant des services accessibles, adaptés et de proximité.'),
            'apropos_intro3'        => Setting::get('apropos_intro3',   'Notre mission est de démocratiser l\'accès aux technologies numériques en accompagnant les entreprises, les institutions et les particuliers dans leur transformation digitale, tout en garantissant la sécurité de leurs infrastructures et de leurs données.'),
            'apropos_intro4'        => Setting::get('apropos_intro4',   'Grâce à une équipe jeune, dynamique et polyvalente, Hindo Digital se positionne comme un partenaire de confiance, capable d\'apporter des solutions complètes et durables adaptées aux réalités locales.'),
            'apropos_mission'       => Setting::get('apropos_mission',  'Démocratiser l\'accès aux technologies numériques en accompagnant les entreprises, les institutions et les particuliers dans leur transformation digitale, tout en garantissant la sécurité de leurs infrastructures et de leurs données.'),
            'apropos_vision'        => Setting::get('apropos_vision',   'Devenir le partenaire numérique de référence au Sénégal, en proposant des services accessibles, adaptés et de proximité. Nous aspirons à construire un écosystème digital inclusif qui propulse le développement économique local et régional.'),
            'apropos_impact1'       => Setting::get('apropos_impact1',  'Dans un contexte où la transformation numérique est devenue un enjeu majeur pour le développement économique, Hindo Digital joue un rôle clé en rendant le numérique accessible à tous les segments de la société sénégalaise.'),
            'apropos_impact2'       => Setting::get('apropos_impact2',  'En formant les jeunes aux métiers du numérique, en accompagnant les PME dans leur digitalisation et en sécurisant les infrastructures des institutions, nous contribuons directement à la création d\'emplois et à la compétitivité des acteurs économiques locaux.'),

            // Valeurs
            'valeur1_titre'         => Setting::get('valeur1_titre', 'Innovation'),
            'valeur1_texte'         => Setting::get('valeur1_texte', 'Nous cherchons constamment des solutions nouvelles et créatives pour répondre aux défis numériques de nos clients et de la société.'),
            'valeur2_titre'         => Setting::get('valeur2_titre', 'Proximité'),
            'valeur2_texte'         => Setting::get('valeur2_texte', 'Inspirée du mot "Hindo" (résidence, lieu d\'origine), l\'entreprise met un point d\'honneur à être proche des populations qu\'elle sert.'),
            'valeur3_titre'         => Setting::get('valeur3_titre', 'Excellence'),
            'valeur3_texte'         => Setting::get('valeur3_texte', 'Des solutions complètes, durables et adaptées aux réalités locales, délivrées avec rigueur et professionnalisme.'),
            'valeur4_titre'         => Setting::get('valeur4_titre', 'Confiance'),
            'valeur4_texte'         => Setting::get('valeur4_texte', 'Une équipe jeune, dynamique et polyvalente qui se positionne comme un partenaire de confiance pour chaque client.'),

            // ---- PAGE CONTACT ----
            'contact_horaire_lv'    => Setting::get('contact_horaire_lv',  '08h — 18h'),
            'contact_horaire_sam'   => Setting::get('contact_horaire_sam', '09h — 14h'),
            'contact_horaire_dim'   => Setting::get('contact_horaire_dim', 'Fermé'),
        ];
    }
}
