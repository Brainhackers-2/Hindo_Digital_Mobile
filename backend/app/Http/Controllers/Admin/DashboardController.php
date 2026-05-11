<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\Newsletter;
use App\Models\Realisation;
use App\Models\Service;
use App\Models\Temoignage;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * Admin\DashboardController — Statistiques du tableau de bord
 * Agrège les chiffres clés pour la page d'accueil de l'admin
 * ============================================================
 */
class DashboardController extends Controller
{
    /**
     * Retourne les statistiques globales du site
     * GET /api/v1/admin/dashboard
     */
    public function index(): JsonResponse
    {
        $stats = [
            'contacts'     => [
                'total'   => Contact::count(),
                'non_lus' => Contact::where('lu', false)->count(),
            ],
            'services'     => Service::count(),
            'realisations' => Realisation::count(),
            'formations'   => Formation::count(),
            'inscriptions' => Inscription::count(),
            'newsletters'  => Newsletter::where('actif', true)->count(),
            'temoignages'  => Temoignage::count(),
        ];

        // 5 derniers messages de contact non lus
        $derniers_contacts = Contact::where('lu', false)
            ->latest()
            ->take(5)
            ->get(['id', 'nom', 'email', 'sujet', 'created_at']);

        // 5 dernières inscriptions
        $dernieres_inscriptions = Inscription::with('formation:id,titre')
            ->latest()
            ->take(5)
            ->get(['id', 'nom', 'email', 'formation_id', 'created_at']);

        return response()->json([
            'success' => true,
            'data'    => compact('stats', 'derniers_contacts', 'dernieres_inscriptions'),
        ]);
    }
}
