<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_inscriptions_table
 * Crée la table des inscriptions aux formations
 * ============================================================
 */
return new class extends Migration
{
    /**
     * Crée la table 'inscriptions'
     */
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('nom');                                           // Nom de l'apprenant
            $table->string('email');                                         // Email de l'apprenant
            $table->string('telephone')->nullable();                        // Téléphone (optionnel)
            // Clé étrangère vers formations — si la formation est supprimée, l'inscription est supprimée
            $table->foreignId('formation_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Supprime la table lors du rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
