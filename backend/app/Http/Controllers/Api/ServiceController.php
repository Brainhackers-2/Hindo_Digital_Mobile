<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * ServiceController — Endpoint public : liste des services
 * Inclut l'URL publique de l'image de chaque service
 * ============================================================
 */
class ServiceController extends Controller
{
    /**
     * GET /api/v1/services
     * Retourne les services triés par ordre avec image_url calculée
     */
    public function index(): JsonResponse
    {
        $services = Service::orderBy('ordre')->get()->map(function ($service) {
            // Génère l'URL publique de l'image si elle existe
            $service->image_url = $service->image_path
                ? asset('storage/' . $service->image_path)
                : null;
            return $service;
        });

        return response()->json([
            'success' => true,
            'data'    => $services,
            'message' => 'Services récupérés avec succès',
        ]);
    }
}
