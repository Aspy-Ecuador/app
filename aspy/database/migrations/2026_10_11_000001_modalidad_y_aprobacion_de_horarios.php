<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Cada horario dice su modalidad (presencial o virtual), guarda el enlace de la reunión si es virtual
 * y necesita la aprobación de Secretaría o del Admin antes de ofrecerse a las familias.
 *
 * - worker_schedule.modalidad: "presencial" (por defecto) o "virtual".
 * - worker_schedule.enlace_virtual: enlace de Zoom, Microsoft Teams o Google Meet.
 * - worker_schedule.aprobado (+ aprobado_por, aprobado_el): los horarios que ya existían quedan aprobados,
 *   para que nada de lo publicado desaparezca.
 *
 * El enlace vivía en la cita (appointment.enlace_virtual): se copia a su horario y la cita deja de usarlo.
 *
 * Es idempotente: solo crea lo que falte.
 */
return new class extends Migration
{
    private const COLUMNAS = ['modalidad', 'enlace_virtual', 'aprobado', 'aprobado_por', 'aprobado_el'];

    public function up(): void
    {
        if (! Schema::hasTable('worker_schedule')) {
            return;
        }
        $falta = fn (string $columna) => ! Schema::hasColumn('worker_schedule', $columna);

        Schema::table('worker_schedule', function (Blueprint $table) use ($falta) {
            if ($falta('modalidad')) {
                $table->string('modalidad', 12)->default('presencial');
            }
            if ($falta('enlace_virtual')) {
                $table->string('enlace_virtual', 500)->nullable();
            }
            if ($falta('aprobado')) {
                $table->boolean('aprobado')->default(true);
            }
            if ($falta('aprobado_por')) {
                $table->unsignedBigInteger('aprobado_por')->nullable();
            }
            if ($falta('aprobado_el')) {
                $table->timestamp('aprobado_el')->nullable();
            }
        });

        if (Schema::hasTable('appointment') && Schema::hasColumn('appointment', 'enlace_virtual')) {
            $citas = DB::table('appointment')->whereNotNull('enlace_virtual')->where('enlace_virtual', '!=', '')->get(['worker_schedule_id', 'enlace_virtual']);
            foreach ($citas as $cita) {
                DB::table('worker_schedule')
                    ->where('worker_schedule_id', $cita->worker_schedule_id)
                    ->whereNull('enlace_virtual')
                    ->update(['modalidad' => 'virtual', 'enlace_virtual' => $cita->enlace_virtual]);
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('worker_schedule')) {
            return;
        }
        $sobran = array_values(array_filter(self::COLUMNAS, fn (string $columna) => Schema::hasColumn('worker_schedule', $columna)));
        if ($sobran) {
            Schema::table('worker_schedule', fn (Blueprint $table) => $table->dropColumn($sobran));
        }
    }
};
