<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * aviso: lo que el sistema le cuenta a una cuenta (alguien reservó una cita contigo, tu comprobante fue
 * aprobado o rechazado, aprobaron tu horario…). Cada fila es de una sola cuenta y trae la pantalla a la
 * que lleva. Lo que está "por revisar" (pagos, horarios) no se guarda aquí: se cuenta en el momento.
 *
 * Es idempotente: solo crea lo que falte.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('aviso')) {
            Schema::create('aviso', function (Blueprint $table) {
                $table->increments('aviso_id');
                $table->integer('user_account_id');
                $table->string('tipo', 40);
                $table->string('titulo', 160);
                $table->string('texto', 700);
                $table->string('enlace', 200)->nullable();
                // Cuántos hechos iguales junta ("Aprobaron 5 horarios tuyos"); casi siempre 1
                $table->unsignedSmallInteger('cantidad')->default(1);
                $table->timestamp('leido_el')->nullable();
                $table->timestamp('creado_el')->nullable();
                $table->index(['user_account_id', 'aviso_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('aviso');
    }
};
