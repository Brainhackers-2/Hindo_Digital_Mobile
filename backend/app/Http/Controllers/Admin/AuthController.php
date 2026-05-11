<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * ============================================================
 * Admin\AuthController — Authentification de l'administrateur
 * Login / logout via token Sanctum
 * ============================================================
 */
class AuthController extends Controller
{
    /**
     * Connecte l'administrateur et retourne un token API
     * POST /api/v1/admin/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required'    => 'L\'email est obligatoire.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        // Tentative d'authentification
        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants incorrects. Vérifiez votre email et mot de passe.',
            ], 401);
        }

        $user  = Auth::user();
        // Révoque les anciens tokens avant d'en créer un nouveau
        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'data'    => [
                'token' => $token,
                'user'  => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
            ],
        ]);
    }

    /**
     * Déconnecte l'administrateur en révoquant son token
     * POST /api/v1/admin/logout
     */
    public function logout(Request $request): JsonResponse
    {
        // Révoque uniquement le token utilisé pour cette requête
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * Retourne les informations de l'administrateur connecté
     * GET /api/v1/admin/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user(),
        ]);
    }
}
