<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * Admin\InscriptionAdminController — Consultation des inscriptions
 * ============================================================
 */
class InscriptionAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $inscriptions = Inscription::with('formation:id,titre')->latest()->get();
        return response()->json(['success' => true, 'data' => $inscriptions]);
    }

    public function destroy(Inscription $inscription): JsonResponse
    {
        $inscription->delete();
        return response()->json(['success' => true, 'message' => 'Inscription supprimée.']);
    }
}
