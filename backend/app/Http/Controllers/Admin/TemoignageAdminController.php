<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Temoignage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * Admin\TemoignageAdminController — CRUD des témoignages clients
 * ============================================================
 */
class TemoignageAdminController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Temoignage::latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom'   => ['required', 'string', 'max:100'],
            'poste' => ['nullable', 'string', 'max:150'],
            'texte' => ['required', 'string'],
            'note'  => ['required', 'integer', 'min:1', 'max:5'],
            'actif' => ['boolean'],
        ]);

        $temoignage = Temoignage::create($data);
        return response()->json(['success' => true, 'data' => $temoignage, 'message' => 'Témoignage ajouté.'], 201);
    }

    public function update(Request $request, Temoignage $temoignage): JsonResponse
    {
        $data = $request->validate([
            'nom'   => ['required', 'string', 'max:100'],
            'poste' => ['nullable', 'string', 'max:150'],
            'texte' => ['required', 'string'],
            'note'  => ['required', 'integer', 'min:1', 'max:5'],
            'actif' => ['boolean'],
        ]);

        $temoignage->update($data);
        return response()->json(['success' => true, 'data' => $temoignage, 'message' => 'Témoignage mis à jour.']);
    }

    public function destroy(Temoignage $temoignage): JsonResponse
    {
        $temoignage->delete();
        return response()->json(['success' => true, 'message' => 'Témoignage supprimé.']);
    }
}
