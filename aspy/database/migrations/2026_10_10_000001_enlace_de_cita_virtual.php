<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * appointment.enlace_virtual: enlace de la reunión (Zoom, Microsoft Teams o Google Meet) cuando la cita
 * es virtual. Vacío = la cita es presencial.
 *
 * Los ajustes nuevos de horarios (hasta cuándo se pueden crear y si Secretaría puede crearlos) no
 * necesitan columnas: son filas de la tabla `ajuste`.
 *
 * Es idempotente: solo crea lo que falte.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('appointment') && ! Schema::hasColumn('appointment', 'enlace_virtual')) {
            Schema::table('appointment', function (Blueprint $table) {
                $table->string('enlace_virtual', 500)->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('appointment') && Schema::hasColumn('appointment', 'enlace_virtual')) {
            Schema::table('appointment', function (Blueprint $table) {
                $table->dropColumn('enlace_virtual');
            });
        }
    }
};
