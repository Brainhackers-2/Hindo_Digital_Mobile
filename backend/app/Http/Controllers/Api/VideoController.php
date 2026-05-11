<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * VideoController — Endpoint public : vidéos actives
 * GET /api/v1/videos
 * ============================================================
 */
class VideoController extends Controller
{
    public function index(): JsonResponse
    {
        $videos = Video::where('actif', true)
            ->orderBy('ordre')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($v) => [
                'id'               => $v->id,
                'titre'            => $v->titre,
                'description'      => $v->description,
                'type'             => $v->type,
                'categorie'        => $v->categorie,
                'embed_url'        => $v->embed_url,
                'url_lecture'      => $v->url_lecture,
                'thumbnail_url'    => $v->thumbnail_url,
                'youtube_id'       => $v->youtube_id,
                'est_fichier_local' => !is_null($v->video_file_path),
            ]);

        return response()->json(['success' => true, 'data' => $videos]);
    }
}
