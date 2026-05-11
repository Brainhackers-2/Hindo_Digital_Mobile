<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Realisation;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * RealisationController — Contrôleur pour la galerie des réalisations
 * Sert les données de projets avec les URLs d'images stockées
 * ============================================================
 */
class RealisationController extends Controller
{
    /**
     * Retourne la liste de toutes les réalisations avec leurs images.
     *
     * GET /api/v1/realisations
     *
     * @return JsonResponse — { success: true, data: [...], message: string }
     */
    public function index(): JsonResponse
    {
        // Récupère les réalisations et transforme le chemin image en URL publique
        $realisations = Realisation::latest()->get()->map(function ($realisation) {
            // Génère l'URL de stockage Laravel si un chemin d'image existe
            if ($realisation->image_path) {
                $realisation->image_url = asset('storage/' . $realisation->image_path);
            } else {
                $realisation->image_url = null;
            }
            return $realisation;
        });

        return response()->json([
            'success' => true,
            'data'    => $realisations,
            'message' => 'Réalisations récupérées avec succès',
        ]);
    }
}
