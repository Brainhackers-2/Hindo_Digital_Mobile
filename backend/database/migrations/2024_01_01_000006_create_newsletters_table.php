<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_newsletters_table
 * Crée la table des abonnés à la newsletter de Hindo Digital
 * ============================================================
 */
return new class extends Migration
{
    /**
     * Crée la table 'newsletters'
     */
    public function up(): void
    {
        Schema::create('newsletters', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique(); // Email unique — pas de doublon possible
            $table->boolean('actif')->default(true); // true = abonné actif
            $table->timestamps();
        });
    }

    /**
     * Supprime la table lors du rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletters');
    }
};
