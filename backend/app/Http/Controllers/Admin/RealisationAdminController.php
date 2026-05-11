<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Realisation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * ============================================================
 * Admin\RealisationAdminController — CRUD des réalisations
 * Gestion des images via Laravel Storage
 * ============================================================
 */
class RealisationAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $realisations = Realisation::latest()->get()->map(function ($r) {
            $r->image_url = $r->image_path ? asset('storage/' . $r->image_path) : null;
            return $r;
        });
        return response()->json(['success' => true, 'data' => $realisations]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:200'],
            'categorie'   => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // 5 Mo max
        ]);

        // Upload de l'image si fournie
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('realisations', 'public');
        }

        unset($data['image']);
        $realisation = Realisation::create($data);
        $realisation->image_url = $realisation->image_path ? asset('storage/' . $realisation->image_path) : null;

        return response()->json(['success' => true, 'data' => $realisation, 'message' => 'Réalisation créée.'], 201);
    }

    public function update(Request $request, Realisation $realisation): JsonResponse
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:200'],
            'categorie'   => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        // Remplace l'ancienne image si une nouvelle est envoyée
        if ($request->hasFile('image')) {
            if ($realisation->image_path) {
                Storage::disk('public')->delete($realisation->image_path);
            }
            $data['image_path'] = $request->file('image')->store('realisations', 'public');
        }

        unset($data['image']);
        $realisation->update($data);
        $realisation->image_url = $realisation->image_path ? asset('storage/' . $realisation->image_path) : null;

        return response()->json(['success' => true, 'data' => $realisation, 'message' => 'Réalisation mise à jour.']);
    }

    public function destroy(Realisation $realisation): JsonResponse
    {
        // Supprime l'image du stockage avant de supprimer l'entrée
        if ($realisation->image_path) {
            Storage::disk('public')->delete($realisation->image_path);
        }
        $realisation->delete();
        return response()->json(['success' => true, 'message' => 'Réalisation supprimée.']);
    }
}
