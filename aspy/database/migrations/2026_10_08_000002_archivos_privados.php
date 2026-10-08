<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Comprobantes de pago y reportes de sesión guardados en el servidor (antes iban a Cloudinary con
 * enlaces públicos: cualquiera con el enlace podía abrirlos).
 *
 * - archivo_privado: el archivo, cifrado, con quién lo subió y a qué comprobante o reporte pertenece.
 * - archivo_privado_acceso: quién subió o abrió cada archivo y cuándo.
 *
 * Es idempotente: si las tablas ya existen, no hace nada.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('archivo_privado')) {
            Schema::create('archivo_privado', function (Blueprint $table) {
                $table->increments('archivo_privado_id');
                $table->string('tipo', 20); // comprobante | reporte
                $table->string('nombre', 255);
                $table->string('mime', 100);
                $table->unsignedInteger('tamano'); // bytes del archivo original
                $table->longText('contenido'); // cifrado y en base64 (ver ArchivoPrivado)
                $table->unsignedInteger('subido_por'); // user_account_id
                $table->unsignedInteger('payment_data_id')->nullable()->index();
                $table->unsignedInteger('appointment_report_id')->nullable()->index();
                $table->timestamp('creation_date')->nullable();
            });
        }

        if (! Schema::hasTable('archivo_privado_acceso')) {
            Schema::create('archivo_privado_acceso', function (Blueprint $table) {
                $table->increments('archivo_privado_acceso_id');
                $table->unsignedInteger('archivo_privado_id')->index();
                $table->unsignedInteger('user_account_id');
                $table->string('accion', 10); // subir | ver
                $table->timestamp('creation_date')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('archivo_privado_acceso');
        Schema::dropIfExists('archivo_privado');
    }
};
