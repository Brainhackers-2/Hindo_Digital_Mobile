<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * Admin\FormationAdminController — CRUD des formations
 * ============================================================
 */
class FormationAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $formations = Formation::withCount('inscriptions')->orderBy('titre')->get();
        return response()->json(['success' => true, 'data' => $formations]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'duree'       => ['required', 'string', 'max:100'],
            'niveau'      => ['required', 'in:Débutant,Intermédiaire,Avancé'],
            'prix'        => ['nullable', 'integer', 'min:0'],
        ]);

        $formation = Formation::create($data);
        return response()->json(['success' => true, 'data' => $formation, 'message' => 'Formation créée.'], 201);
    }

    public function update(Request $request, Formation $formation): JsonResponse
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'duree'       => ['required', 'string', 'max:100'],
            'niveau'      => ['required', 'in:Débutant,Intermédiaire,Avancé'],
            'prix'        => ['nullable', 'integer', 'min:0'],
        ]);

        $formation->update($data);
        return response()->json(['success' => true, 'data' => $formation, 'message' => 'Formation mise à jour.']);
    }

    public function destroy(Formation $formation): JsonResponse
    {
        $formation->delete();
        return response()->json(['success' => true, 'message' => 'Formation supprimée.']);
    }
}
