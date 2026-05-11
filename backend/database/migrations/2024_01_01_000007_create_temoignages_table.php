<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_temoignages_table
 * Crée la table des témoignages clients pour la page d'accueil
 * ============================================================
 */
return new class extends Migration
{
    /**
     * Crée la table 'temoignages'
     */
    public function up(): void
    {
        Schema::create('temoignages', function (Blueprint $table) {
            $table->id();
            $table->string('nom');                           // Nom du client
            $table->string('poste')->nullable();             // Poste/entreprise du client
            $table->text('texte');                           // Corps du témoignage
            $table->unsignedTinyInteger('note')->default(5); // Note de 1 à 5
            $table->boolean('actif')->default(true);         // Visible sur le site ou non
            $table->timestamps();
        });
    }

    /**
     * Supprime la table lors du rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('temoignages');
    }
};
