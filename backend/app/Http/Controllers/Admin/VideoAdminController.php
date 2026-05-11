<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * ============================================================
 * Admin\VideoAdminController — CRUD vidéos avec upload de fichiers
 * YouTube, Vimeo, URL distante ET fichiers vidéo locaux (.mp4, .webm...)
 * ============================================================
 */
class VideoAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $videos = Video::orderBy('ordre')->orderBy('created_at', 'desc')
            ->get()->map(fn($v) => $this->formater($v));
        return response()->json(['success' => true, 'data' => $videos]);
    }

    /** Crée une vidéo — URL ou fichier uploadé */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'titre'      => ['required', 'string', 'max:200'],
            'description'=> ['nullable', 'string'],
            'type'       => ['required', 'in:youtube,vimeo,fichier'],
            'categorie'  => ['nullable', 'string', 'max:100'],
            'actif'      => ['nullable'],
            'ordre'      => ['nullable', 'integer'],
            'thumbnail'  => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'url_video'  => ['nullable', 'string', 'max:500'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,webm,avi,mov,mkv,m4v', 'max:512000'],
        ]);

        $data = $this->extraireData($request);
        $video = Video::create($data);

        return response()->json(['success' => true, 'data' => $this->formater($video), 'message' => 'Vidéo ajoutée.'], 201);
    }

    /** Met à jour une vidéo */
    public function update(Request $request, Video $video): JsonResponse
    {
        $request->validate([
            'titre'      => ['required', 'string', 'max:200'],
            'description'=> ['nullable', 'string'],
            'type'       => ['required', 'in:youtube,vimeo,fichier'],
            'categorie'  => ['nullable', 'string', 'max:100'],
            'actif'      => ['nullable'],
            'ordre'      => ['nullable', 'integer'],
            'thumbnail'  => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'url_video'  => ['nullable', 'string', 'max:500'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,webm,avi,mov,mkv,m4v', 'max:512000'],
        ]);

        $data = $this->extraireData($request, $video);
        $video->update($data);

        return response()->json(['success' => true, 'data' => $this->formater($video->fresh()), 'message' => 'Vidéo mise à jour.']);
    }

    /** Supprime la vidéo et ses fichiers associés */
    public function destroy(Video $video): JsonResponse
    {
        if ($video->thumbnail_path)  Storage::disk('public')->delete($video->thumbnail_path);
        if ($video->video_file_path) Storage::disk('public')->delete($video->video_file_path);
        $video->delete();
        return response()->json(['success' => true, 'message' => 'Vidéo supprimée.']);
    }

    /** Extrait et prépare les données de la requête (store + update) */
    private function extraireData(Request $request, ?Video $existante = null): array
    {
        $data = $request->only(['titre', 'description', 'type', 'categorie', 'ordre']);
        $data['actif'] = filter_var($request->actif ?? true, FILTER_VALIDATE_BOOLEAN);

        // Miniature personnalisée
        if ($request->hasFile('thumbnail')) {
            if ($existante?->thumbnail_path) Storage::disk('public')->delete($existante->thumbnail_path);
            $data['thumbnail_path'] = $request->file('thumbnail')->store('videos/thumbnails', 'public');
        }

        // Fichier vidéo uploadé depuis l'ordinateur
        if ($request->hasFile('video_file')) {
            if ($existante?->video_file_path) Storage::disk('public')->delete($existante->video_file_path);
            $data['video_file_path'] = $request->file('video_file')->store('videos/fichiers', 'public');
            // L'URL de lecture = chemin public du fichier stocké
            $data['url_video'] = asset('storage/' . $data['video_file_path']);
        } else {
            // URL distante (YouTube, Vimeo ou lien direct)
            $data['url_video'] = $request->url_video ?? ($existante?->url_video ?? '');
            // Si on passe à une URL, on supprime l'ancien fichier local
            if ($existante?->video_file_path && $request->filled('url_video')) {
                Storage::disk('public')->delete($existante->video_file_path);
                $data['video_file_path'] = null;
            }
        }

        return $data;
    }

    /** Formate une vidéo pour la réponse JSON */
    private function formater(Video $v): array
    {
        return [
            'id'              => $v->id,
            'titre'           => $v->titre,
            'description'     => $v->description,
            'url_video'       => $v->url_video,
            'video_file_path' => $v->video_file_path,
            'type'            => $v->type,
            'categorie'       => $v->categorie,
            'actif'           => $v->actif,
            'ordre'           => $v->ordre,
            'embed_url'       => $v->embed_url,
            'url_lecture'     => $v->url_lecture,
            'thumbnail_url'   => $v->thumbnail_url,
            'youtube_id'      => $v->youtube_id,
            'est_fichier_local'=> !is_null($v->video_file_path),
        ];
    }
}
