<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * ============================================================
 * Admin\SettingAdminController — Gestion du logo et des images globales
 * Logo du site + Photo de l'équipe fondatrice (page À propos)
 * ============================================================
 */
class SettingAdminController extends Controller
{
    /**
     * Retourne les paramètres actuels (logo + photo équipe)
     * GET /api/v1/admin/settings
     */
    public function index(): JsonResponse
    {
        $logoPath  = Setting::get('logo_path');
        $teamPath  = Setting::get('team_image_path');

        return response()->json([
            'success' => true,
            'data'    => [
                'logo_path'        => $logoPath,
                'logo_url'         => $logoPath  ? asset('storage/' . $logoPath)  : null,
                'team_image_path'  => $teamPath,
                'team_image_url'   => $teamPath  ? asset('storage/' . $teamPath)  : null,
            ],
        ]);
    }

    // ============================================================
    // LOGO DU SITE
    // ============================================================

    /** Upload ou remplace le logo du site — POST /api/v1/admin/settings/logo */
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => ['required', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:2048'],
        ], [
            'logo.required' => 'Veuillez sélectionner un fichier logo.',
            'logo.mimes'    => 'Formats acceptés : PNG, JPG, SVG, WebP.',
            'logo.max'      => 'Le logo ne doit pas dépasser 2 Mo.',
        ]);

        $ancien = Setting::get('logo_path');
        if ($ancien && Storage::disk('public')->exists($ancien)) {
            Storage::disk('public')->delete($ancien);
        }

        $path = $request->file('logo')->store('logos', 'public');
        Setting::set('logo_path', $path);

        return response()->json([
            'success' => true,
            'message' => 'Logo mis à jour avec succès.',
            'data'    => ['logo_url' => asset('storage/' . $path)],
        ]);
    }

    /** Supprime le logo — DELETE /api/v1/admin/settings/logo */
    public function deleteLogo(): JsonResponse
    {
        $path = Setting::get('logo_path');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::set('logo_path', null);

        return response()->json(['success' => true, 'message' => 'Logo supprimé. Logo par défaut restauré.']);
    }

    // ============================================================
    // PHOTO DE L'ÉQUIPE (page À propos)
    // ============================================================

    /**
     * Upload ou remplace la photo de l'équipe fondatrice
     * POST /api/v1/admin/settings/team-image
     * Formats acceptés : JPG, PNG, WebP — max 5 Mo
     */
    public function uploadTeamImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ], [
            'image.required' => 'Veuillez sélectionner une photo.',
            'image.image'    => 'Le fichier doit être une image.',
            'image.mimes'    => 'Formats acceptés : JPG, PNG, WebP.',
            'image.max'      => 'La photo ne doit pas dépasser 5 Mo.',
        ]);

        // Supprime l'ancienne photo si elle existe
        $ancienne = Setting::get('team_image_path');
        if ($ancienne && Storage::disk('public')->exists($ancienne)) {
            Storage::disk('public')->delete($ancienne);
        }

        // Stocke dans storage/app/public/team/
        $path = $request->file('image')->store('team', 'public');
        Setting::set('team_image_path', $path);

        return response()->json([
            'success' => true,
            'message' => 'Photo de l\'équipe mise à jour avec succès.',
            'data'    => ['team_image_url' => asset('storage/' . $path)],
        ]);
    }

    /**
     * Supprime la photo de l'équipe (revient au placeholder)
     * DELETE /api/v1/admin/settings/team-image
     */
    public function deleteTeamImage(): JsonResponse
    {
        $path = Setting::get('team_image_path');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::set('team_image_path', null);

        return response()->json(['success' => true, 'message' => 'Photo supprimée. Le placeholder est restauré.']);
    }
}
