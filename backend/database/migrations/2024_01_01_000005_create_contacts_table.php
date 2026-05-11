<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_contacts_table
 * Crée la table des messages reçus via le formulaire de contact
 * ============================================================
 */
return new class extends Migration
{
    /**
     * Crée la table 'contacts'
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('nom');                           // Nom de l'expéditeur
            $table->string('email');                         // Email de l'expéditeur
            $table->string('telephone')->nullable();         // Téléphone (optionnel)
            $table->string('sujet');                         // Sujet du message
            $table->text('message');                         // Corps du message
            $table->boolean('lu')->default(false);           // false = non lu, true = lu (par l'admin)
            $table->timestamps();
        });
    }

    /**
     * Supprime la table lors du rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
