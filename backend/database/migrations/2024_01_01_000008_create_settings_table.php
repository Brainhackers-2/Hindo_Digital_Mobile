<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : create_settings_table
 * Stocke les paramètres du site : logo, favicon, etc.
 * Système clé → valeur pour une flexibilité maximale
 * ============================================================
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();    // Ex: 'logo_path', 'favicon_path'
            $table->text('value')->nullable();  // Valeur du paramètre
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
