<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * SettingController — Endpoint public : logo + photo d'équipe
 * GET /api/v1/settings
 * ============================================================
 */
class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $logoPath = Setting::get('logo_path');
        $teamPath = Setting::get('team_image_path');

        return response()->json([
            'success' => true,
            'data'    => [
                'logo_url'       => $logoPath ? asset('storage/' . $logoPath) : null,
                'team_image_url' => $teamPath ? asset('storage/' . $teamPath) : null,
            ],
        ]);
    }
}
