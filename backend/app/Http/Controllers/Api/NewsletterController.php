<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use App\Http\Requests\NewsletterRequest;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * NewsletterController — Contrôleur pour l'abonnement newsletter
 * Gère l'inscription et la déduplication des abonnés
 * ============================================================
 */
class NewsletterController extends Controller
{
    /**
     * Inscrit un email à la newsletter Hindo Digital.
     *
     * POST /api/v1/newsletter
     *
     * @param  NewsletterRequest $request — { email }
     * @return JsonResponse
     */
    public function store(NewsletterRequest $request): JsonResponse
    {
        // Vérifie si l'email est déjà abonné pour éviter les doublons
        $existant = Newsletter::where('email', $request->email)->first();

        if ($existant) {
            // Si déjà inscrit mais inactif, on réactive l'abonnement
            if (!$existant->actif) {
                $existant->update(['actif' => true]);
                return response()->json([
                    'success' => true,
                    'message' => 'Votre abonnement a été réactivé avec succès.',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Cette adresse email est déjà inscrite à notre newsletter.',
            ], 409); // 409 Conflict
        }

        // Crée le nouvel abonné
        Newsletter::create([
            'email' => $request->email,
            'actif'  => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Merci ! Vous êtes maintenant abonné à notre newsletter.',
        ], 201);
    }
}
