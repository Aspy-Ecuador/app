<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Sincroniza el esquema con lo que usa el código (y con la BD de producción):
 * - user_account.is_available: el login rechaza cuentas sin este flag.
 * - service.is_available: disponibilidad de servicios.
 * - appointment_status "Cancelada" (id 5): usado al cancelar citas.
 *
 * Es idempotente: si la columna o el estado ya existen, no hace nada.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('user_account', 'is_available')) {
            Schema::table('user_account', function (Blueprint $table) {
                $table->boolean('is_available')->default(true);
            });
        }

        if (! Schema::hasColumn('service', 'is_available')) {
            Schema::table('service', function (Blueprint $table) {
                $table->boolean('is_available')->default(true);
            });
        }

        // Solo en BDs con datos: en una instalación nueva el DatabaseSeeder ya crea los 5 estados.
        $hasStatuses = DB::table('appointment_status')->exists();
        if ($hasStatuses && ! DB::table('appointment_status')->where('appointment_status_id', 5)->exists()) {
            DB::table('appointment_status')->insert([
                'appointment_status_id' => 5,
                'name' => 'Cancelada',
            ]);
        }
    }

    public function down(): void
    {
        // No se revierte: en producción estas columnas existían antes de esta migración.
    }
};
