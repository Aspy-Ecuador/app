<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('user_consents')) {
            Schema::create('user_consents', function (Blueprint $table) {
                $table->increments('consent_id');
                $table->unsignedInteger('user_id');
                $table->string('policy_version', 10);
                $table->ipAddress('ip_address')->nullable();
                $table->timestampTz('accepted_at')->useCurrent();
                $table->foreign('user_id')->references('user_account_id')->on('user_account')->cascadeOnDelete();
                $table->index('user_id', 'idx_user_consents_user_id');
            });

            return;
        }

        Schema::table('user_consents', function (Blueprint $table) {
            $table->dropForeign('fk_user');
            $table->foreign('user_id')->references('user_account_id')->on('user_account')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_consents');
    }
};
