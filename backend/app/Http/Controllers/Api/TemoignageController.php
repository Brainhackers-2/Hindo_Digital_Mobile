<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Temoignage;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * TemoignageController — Contrôleur pour les témoignages clients
 * Expose les avis clients pour la section témoignages de l'accueil
 * ============================================================
 */
class TemoignageController extends Controller
{
    /**
     * Retourne la liste des témoignages actifs triés par date.
     *
     * GET /api/v1/temoignages
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Récupère uniquement les témoignages marqués comme actifs (validés)
        $temoignages = Temoignage::where('actif', true)
            ->latest()
            ->take(6) // Limite à 6 témoignages pour l'affichage page d'accueil
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $temoignages,
            'message' => 'Témoignages récupérés avec succès',
        ]);
    }
}
