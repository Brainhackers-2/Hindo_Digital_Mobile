<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : add_video_file_path_to_videos_table
 * Ajoute une colonne pour stocker le chemin du fichier vidéo uploadé
 * Permet de distinguer les vidéos uploadées des URLs distantes
 * ============================================================
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            // Chemin du fichier vidéo uploadé dans storage/app/public/videos/
            // null = vidéo distante (YouTube/Vimeo/URL)
            $table->string('video_file_path')->nullable()->after('url_video');
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn('video_file_path');
        });
    }
};
