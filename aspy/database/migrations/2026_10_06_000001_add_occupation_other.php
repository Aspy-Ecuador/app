<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Ocupación "Otra": la persona escribe la suya (person.occupation_other).
 * Agrega la ocupación id 10 "Otra" en BDs que ya tienen el catálogo
 * (en una instalación nueva la crea el DatabaseSeeder). Es idempotente.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('person', 'occupation_other')) {
            Schema::table('person', function (Blueprint $table) {
                $table->string('occupation_other', 80)->nullable();
            });
        }

        $hayCatalogo = DB::table('occupation')->exists();
        if ($hayCatalogo && ! DB::table('occupation')->where('occupation_id', 10)->exists()) {
            DB::table('occupation')->insert(['occupation_id' => 10, 'name' => 'Otra']);
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('person', 'occupation_other')) {
            Schema::table('person', function (Blueprint $table) {
                $table->dropColumn('occupation_other');
            });
        }
    }
};
