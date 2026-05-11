<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * ============================================================
 * Admin\ServiceAdminController — CRUD des services avec images
 * Chaque service peut avoir une image uploadée via multipart/form-data
 * ============================================================
 */
class ServiceAdminController extends Controller
{
    /** Liste tous les services avec leur URL d'image */
    public function index(): JsonResponse
    {
        $services = Service::orderBy('ordre')->get()->map(function ($s) {
            $s->image_url = $s->image_path ? asset('storage/' . $s->image_path) : null;
            return $s;
        });

        return response()->json(['success' => true, 'data' => $services]);
    }

    /**
     * Crée un nouveau service (avec image optionnelle)
     * POST /api/v1/admin/services  — multipart/form-data
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:150'],
            'description' => ['required', 'string'],
            'icone'       => ['required', 'string', 'max:50'],
            'ordre'       => ['nullable', 'integer'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('services', 'public');
        }

        unset($data['image']);
        $service = Service::create($data);
        $service->image_url = $service->image_path ? asset('storage/' . $service->image_path) : null;

        return response()->json(['success' => true, 'data' => $service, 'message' => 'Service créé.'], 201);
    }

    /**
     * Met à jour un service (avec remplacement d'image optionnel)
     * POST /api/v1/admin/services/{service}  — multipart/form-data
     * (POST car FormData ne supporte pas PUT nativement)
     */
    public function update(Request $request, Service $service): JsonResponse
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:150'],
            'description' => ['required', 'string'],
            'icone'       => ['required', 'string', 'max:50'],
            'ordre'       => ['nullable', 'integer'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
        ]);

        // Remplace l'ancienne image si une nouvelle est envoyée
        if ($request->hasFile('image')) {
            if ($service->image_path) {
                Storage::disk('public')->delete($service->image_path);
            }
            $data['image_path'] = $request->file('image')->store('services', 'public');
        }

        unset($data['image']);
        $service->update($data);
        $service->image_url = $service->image_path ? asset('storage/' . $service->image_path) : null;

        return response()->json(['success' => true, 'data' => $service, 'message' => 'Service mis à jour.']);
    }

    /**
     * Supprime uniquement l'image d'un service (sans supprimer le service)
     * DELETE /api/v1/admin/services/{service}/image
     */
    public function deleteImage(Service $service): JsonResponse
    {
        if ($service->image_path) {
            Storage::disk('public')->delete($service->image_path);
            $service->update(['image_path' => null]);
        }

        return response()->json(['success' => true, 'message' => 'Image supprimée.']);
    }

    /** Supprime le service et son image */
    public function destroy(Service $service): JsonResponse
    {
        if ($service->image_path) {
            Storage::disk('public')->delete($service->image_path);
        }
        $service->delete();

        return response()->json(['success' => true, 'message' => 'Service supprimé.']);
    }
}
