<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_realisations_table
 * Crée la table des projets réalisés (galerie) de Hindo Digital
 * ============================================================
 */
return new class extends Migration
{
    /**
     * Crée la table 'realisations'
     */
    public function up(): void
    {
        Schema::create('realisations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');                         // Nom du projet
            $table->string('categorie');                     // Catégorie : Réseaux, Web, etc.
            $table->string('image_path')->nullable();        // Chemin relatif dans storage/
            $table->text('description')->nullable();         // Description du projet
            $table->timestamps();
        });
    }

    /**
     * Supprime la table lors du rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('realisations');
    }
};
