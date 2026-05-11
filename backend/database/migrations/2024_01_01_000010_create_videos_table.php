<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_videos_table
 * Stocke les vidéos de réalisations de Hindo Digital
 * Supporte YouTube, Vimeo et fichiers vidéo directs
 * ============================================================
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('titre');                                     // Titre de la vidéo
            $table->text('description')->nullable();                    // Description du projet
            $table->string('url_video');                                // URL YouTube/Vimeo ou chemin fichier
            $table->enum('type', ['youtube', 'vimeo', 'fichier'])      // Type de source
                  ->default('youtube');
            $table->string('categorie')->nullable();                   // Catégorie du projet
            $table->string('thumbnail_path')->nullable();              // Miniature personnalisée (optionnel)
            $table->boolean('actif')->default(true);                   // Visible sur le site
            $table->unsignedSmallInteger('ordre')->default(0);        // Ordre d'affichage
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
