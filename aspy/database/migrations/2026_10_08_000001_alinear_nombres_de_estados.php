<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * En la base del sitio publicado los estados de cita 3 y 4 se llamaban "Completada" y "Perdida".
 * El sistema, el seeder y los manuales dicen "Asistió" y "No Asistió", y algunas pantallas muestran
 * el nombre tal como está guardado. Se alinean los nombres; los ids no cambian. Es repetible:
 * solo renombra si encuentra el nombre viejo.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('appointment_status')) {
            return;
        }
        DB::table('appointment_status')->where('appointment_status_id', 3)->where('name', 'Completada')->update(['name' => 'Asistió']);
        DB::table('appointment_status')->where('appointment_status_id', 4)->where('name', 'Perdida')->update(['name' => 'No Asistió']);
    }

    public function down(): void
    {
        // No se revierte: los nombres nuevos son los que usa el sistema.
    }
};
