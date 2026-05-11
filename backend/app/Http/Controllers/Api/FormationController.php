<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Inscription;
use App\Http\Requests\InscriptionRequest;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * FormationController — Contrôleur pour les formations
 * Gère la liste des formations et les inscriptions des apprenants
 * ============================================================
 */
class FormationController extends Controller
{
    /**
     * Retourne la liste des formations disponibles.
     *
     * GET /api/v1/formations
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $formations = Formation::orderBy('titre')->get();

        return response()->json([
            'success' => true,
            'data'    => $formations,
            'message' => 'Formations récupérées avec succès',
        ]);
    }

    /**
     * Enregistre l'inscription d'un apprenant à une formation.
     *
     * POST /api/v1/formations/inscription
     *
     * @param  InscriptionRequest $request — Données validées : nom, email, telephone, formation_id
     * @return JsonResponse
     */
    public function inscription(InscriptionRequest $request): JsonResponse
    {
        // Crée l'inscription en base de données avec les données validées
        $inscription = Inscription::create($request->validated());

        return response()->json([
            'success' => true,
            'data'    => $inscription,
            'message' => 'Inscription enregistrée avec succès. Nous vous contacterons sous 24h.',
        ], 201);
    }
}
