<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Video — Vidéos de réalisations Hindo Digital
 * Supporte : YouTube, Vimeo, URL distante, Fichier uploadé
 * ============================================================
 */
class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre', 'description', 'url_video', 'video_file_path',
        'type', 'categorie', 'thumbnail_path', 'actif', 'ordre',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'ordre' => 'integer',
    ];

    /** Extrait l'ID YouTube depuis n'importe quel format d'URL */
    public function getYoutubeIdAttribute(): ?string
    {
        if ($this->type !== 'youtube') return null;
        $url = $this->url_video;
        if (preg_match('/youtu\.be\/([a-zA-Z0-9_-]{11})/', $url, $m))  return $m[1];
        if (preg_match('/[?&]v=([a-zA-Z0-9_-]{11})/', $url, $m))       return $m[1];
        if (preg_match('/embed\/([a-zA-Z0-9_-]{11})/', $url, $m))      return $m[1];
        if (preg_match('/shorts\/([a-zA-Z0-9_-]{11})/', $url, $m))     return $m[1];
        return null;
    }

    /** URL de la miniature : custom > YouTube auto > null */
    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->thumbnail_path) {
            return asset('storage/' . $this->thumbnail_path);
        }
        if ($this->type === 'youtube' && $this->youtube_id) {
            return "https://img.youtube.com/vi/{$this->youtube_id}/maxresdefault.jpg";
        }
        return null;
    }

    /** URL d'embed iframe (YouTube et Vimeo uniquement) */
    public function getEmbedUrlAttribute(): ?string
    {
        if ($this->type === 'youtube' && $this->youtube_id) {
            return "https://www.youtube.com/embed/{$this->youtube_id}?autoplay=1&rel=0";
        }
        if ($this->type === 'vimeo') {
            preg_match('/vimeo\.com\/(\d+)/', $this->url_video, $m);
            return isset($m[1]) ? "https://player.vimeo.com/video/{$m[1]}?autoplay=1" : null;
        }
        return null;
    }

    /**
     * URL de lecture finale envoyée au frontend :
     * - YouTube/Vimeo → URL d'embed pour <iframe>
     * - Fichier uploadé → URL publique storage Laravel
     * - URL distante directe → url_video telle quelle
     */
    public function getUrlLectureAttribute(): ?string
    {
        if (in_array($this->type, ['youtube', 'vimeo'])) {
            return $this->embed_url;
        }
        if ($this->video_file_path) {
            return asset('storage/' . $this->video_file_path);
        }
        return $this->url_video ?: null;
    }
}
