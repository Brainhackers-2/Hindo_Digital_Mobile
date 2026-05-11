<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_services_table
 * Crée la table des services proposés par Hindo Digital
 * ============================================================
 */
return new class extends Migration
{
    /**
     * Crée la table 'services' en base de données MySQL
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();                                        // Clé primaire auto-incrémentée
            $table->string('titre');                             // Nom du service
            $table->text('description');                         // Description courte
            $table->string('icone')->default('code');            // Identifiant de l'icône
            $table->unsignedSmallInteger('ordre')->default(0);  // Ordre d'affichage
            $table->timestamps();                                // created_at, updated_at
        });
    }

    /**
     * Supprime la table si on rollback la migration
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
