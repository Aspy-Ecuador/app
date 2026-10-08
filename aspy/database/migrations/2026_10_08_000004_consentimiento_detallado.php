<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Constancia completa del consentimiento (Ley Orgánica de Protección de Datos Personales):
 * qué declaraciones aceptó la persona, una por una; si lo dio por sí misma o su representante legal
 * (obligatorio en menores de 15 años); desde qué navegador; y cuándo lo retiró, si lo retira.
 *
 * Es idempotente: solo agrega las columnas que falten.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('user_consents')) {
            return;
        }

        $columnas = [
            'declaraciones' => fn (Blueprint $t) => $t->text('declaraciones')->nullable(), // lista JSON
            'calidad' => fn (Blueprint $t) => $t->string('calidad', 20)->nullable(), // titular | representante
            'representante_nombre' => fn (Blueprint $t) => $t->string('representante_nombre', 150)->nullable(),
            'representante_identificacion' => fn (Blueprint $t) => $t->string('representante_identificacion', 20)->nullable(),
            'user_agent' => fn (Blueprint $t) => $t->string('user_agent', 255)->nullable(),
            'revoked_at' => fn (Blueprint $t) => $t->timestampTz('revoked_at')->nullable(),
        ];

        foreach ($columnas as $nombre => $crear) {
            if (! Schema::hasColumn('user_consents', $nombre)) {
                Schema::table('user_consents', $crear);
            }
        }
    }

    public function down(): void
    {
        foreach (['declaraciones', 'calidad', 'representante_nombre', 'representante_identificacion', 'user_agent', 'revoked_at'] as $nombre) {
            if (Schema::hasColumn('user_consents', $nombre)) {
                Schema::table('user_consents', fn (Blueprint $t) => $t->dropColumn($nombre));
            }
        }
    }
};
