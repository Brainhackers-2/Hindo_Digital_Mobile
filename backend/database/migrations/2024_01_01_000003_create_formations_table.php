<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_formations_table
 * Crée la table du catalogue de formations de Hindo Digital
 * ============================================================
 */
return new class extends Migration
{
    /**
     * Crée la table 'formations'
     */
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');                                                    // Intitulé de la formation
            $table->text('description');                                                // Contenu et objectifs
            $table->string('duree');                                                    // Ex: "2 semaines", "30h"
            $table->enum('niveau', ['Débutant', 'Intermédiaire', 'Avancé']);           // Niveau requis
            $table->unsignedInteger('prix')->nullable();                               // Prix en FCFA (null = gratuit)
            $table->timestamps();
        });
    }

    /**
     * Supprime la table lors du rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
