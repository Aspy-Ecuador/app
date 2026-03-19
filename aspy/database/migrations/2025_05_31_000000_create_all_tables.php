<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PostgreSQL no permite ejecutar DDL (CREATE TABLE) dentro de una
     * transacción que ya tuvo un error. Al poner esto en false, Laravel
     * no envuelve toda la migración en una sola transacción, evitando
     * el error 25P02 "current transaction is aborted".
     */
    public $withinTransaction = false;

    public function up(): void
    {
        // ============================================================
        // TABLAS DE CATÁLOGO / LOOKUP (sin dependencias)
        // ============================================================

        Schema::create('role', function (Blueprint $table) {
            $table->increments('role_id');
            $table->string('name', 100);
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
        });

        Schema::create('user_account_status', function (Blueprint $table) {
            $table->increments('user_account_status_id');
            $table->string('name', 100);
        });

        Schema::create('gender', function (Blueprint $table) {
            $table->increments('gender_id');
            $table->string('name', 50);
        });

        Schema::create('occupation', function (Blueprint $table) {
            $table->increments('occupation_id');
            $table->string('name', 100);
        });

        Schema::create('marital_status', function (Blueprint $table) {
            $table->increments('marital_status_id');
            $table->string('name', 100);
        });

        Schema::create('education', function (Blueprint $table) {
            $table->increments('education_id');
            $table->string('name', 100);
        });

        Schema::create('payment_status', function (Blueprint $table) {
            $table->increments('payment_status_id');
            $table->string('name', 100);
        });

        Schema::create('receipt_status', function (Blueprint $table) {
            $table->increments('receipt_status_id');
            $table->string('name', 100);
        });

        Schema::create('appointment_status', function (Blueprint $table) {
            $table->increments('appointment_status_id');
            $table->string('name', 100);
        });

        Schema::create('service', function (Blueprint $table) {
            $table->increments('service_id');
            $table->string('name', 150);
            $table->decimal('price', 10, 2);
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
        });

        // ============================================================
        // GEOGRAFÍA
        // ============================================================

        Schema::create('country', function (Blueprint $table) {
            $table->increments('country_id');
            $table->string('name', 100);
            $table->string('phone_code', 10)->nullable();
        });

        Schema::create('state', function (Blueprint $table) {
            $table->increments('state_id');
            $table->unsignedInteger('country_id');
            $table->string('name', 100);
            $table->foreign('country_id')->references('country_id')->on('country');
        });

        Schema::create('city', function (Blueprint $table) {
            $table->increments('city_id');
            $table->unsignedInteger('state_id');
            $table->string('name', 100);
            $table->foreign('state_id')->references('state_id')->on('state');
        });

        // ============================================================
        // CUENTA DE USUARIO
        // ============================================================

        Schema::create('user_account', function (Blueprint $table) {
            $table->increments('user_account_id');
            $table->unsignedInteger('role_id');
            $table->unsignedInteger('status_id');
            $table->string('email', 150)->unique();
            $table->string('password_hash', 255);
            $table->timestamp('last_login')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('role_id')->references('role_id')->on('role');
            $table->foreign('status_id')->references('user_account_status_id')->on('user_account_status');
        });

        // ============================================================
        // PERSONA BASE
        // ============================================================

        Schema::create('person', function (Blueprint $table) {
            $table->increments('person_id');
            $table->unsignedInteger('user_id')->nullable();
            $table->unsignedInteger('gender_id')->nullable();
            $table->unsignedInteger('occupation_id')->nullable();
            $table->unsignedInteger('marital_status_id')->nullable();
            $table->unsignedInteger('education_id')->nullable();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->date('birthdate')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('user_id')->references('user_account_id')->on('user_account');
            $table->foreign('gender_id')->references('gender_id')->on('gender');
            $table->foreign('occupation_id')->references('occupation_id')->on('occupation');
            $table->foreign('marital_status_id')->references('marital_status_id')->on('marital_status');
            $table->foreign('education_id')->references('education_id')->on('education');
        });

        // ============================================================
        // SUBTIPOS DE PERSONA
        // ============================================================

        Schema::create('client', function (Blueprint $table) {
            $table->unsignedInteger('person_id')->primary();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('person_id')->references('person_id')->on('person');
        });

        Schema::create('professional', function (Blueprint $table) {
            $table->unsignedInteger('person_id')->primary();
            $table->string('specialty', 150)->nullable();
            $table->string('title', 150)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('person_id')->references('person_id')->on('person');
        });

        Schema::create('staff', function (Blueprint $table) {
            $table->unsignedInteger('person_id')->primary();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('person_id')->references('person_id')->on('person');
        });

        // ============================================================
        // DATOS DE CONTACTO Y UBICACIÓN
        // ============================================================

        Schema::create('phone', function (Blueprint $table) {
            $table->increments('phone_id');
            $table->unsignedInteger('person_id');
            $table->string('number', 30);
            $table->string('type', 50)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('person_id')->references('person_id')->on('person');
        });

        Schema::create('address', function (Blueprint $table) {
            $table->increments('address_id');
            $table->unsignedInteger('person_id');
            $table->string('type', 50)->nullable();
            $table->unsignedInteger('country_id')->nullable();
            $table->unsignedInteger('state_id')->nullable();
            $table->unsignedInteger('city_id')->nullable();
            $table->string('primary_address', 255)->nullable();
            $table->string('secondary_address', 255)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('person_id')->references('person_id')->on('person');
            $table->foreign('country_id')->references('country_id')->on('country');
            $table->foreign('state_id')->references('state_id')->on('state');
            $table->foreign('city_id')->references('city_id')->on('city');
        });

        Schema::create('identification', function (Blueprint $table) {
            $table->increments('identification_id');
            $table->unsignedInteger('person_id');
            $table->string('type', 50);
            $table->string('number', 50);
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('person_id')->references('person_id')->on('person');
        });

        // ============================================================
        // SERVICIOS POR PROFESIONAL
        // ============================================================

        Schema::create('professional_service', function (Blueprint $table) {
            $table->increments('professional_service_id');
            $table->unsignedInteger('service_id');
            $table->unsignedInteger('professional_id');
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('service_id')->references('service_id')->on('service');
            $table->foreign('professional_id')->references('person_id')->on('professional');
        });

        // ============================================================
        // AGENDA / HORARIOS
        // ============================================================

        Schema::create('schedule', function (Blueprint $table) {
            $table->increments('schedule_id');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('name', 150)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
        });

        Schema::create('worker_schedule', function (Blueprint $table) {
            $table->increments('worker_schedule_id');
            $table->unsignedInteger('schedule_id');
            $table->unsignedInteger('professional_id');
            $table->boolean('is_available')->default(true);
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('schedule_id')->references('schedule_id')->on('schedule');
            $table->foreign('professional_id')->references('person_id')->on('professional');
        });

        // ============================================================
        // PAGOS
        // ============================================================

        Schema::create('payment_data', function (Blueprint $table) {
            $table->increments('payment_data_id');
            $table->unsignedInteger('client_id');
            $table->string('type', 50)->nullable();
            $table->string('file', 255)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('client_id')->references('person_id')->on('client');
        });

        Schema::create('payment', function (Blueprint $table) {
            $table->increments('payment_id');
            $table->unsignedInteger('client_id');
            $table->unsignedInteger('service_id');
            $table->unsignedInteger('payment_data_id')->nullable();
            $table->unsignedInteger('payment_status_id');
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('client_id')->references('person_id')->on('client');
            $table->foreign('service_id')->references('service_id')->on('service');
            $table->foreign('payment_data_id')->references('payment_data_id')->on('payment_data');
            $table->foreign('payment_status_id')->references('payment_status_id')->on('payment_status');
        });

        Schema::create('receipt', function (Blueprint $table) {
            $table->increments('receipt_id');
            $table->unsignedInteger('payment_id');
            $table->unsignedInteger('receipt_status_id');
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('payment_id')->references('payment_id')->on('payment');
            $table->foreign('receipt_status_id')->references('receipt_status_id')->on('receipt_status');
        });

        // ============================================================
        // CITAS / APPOINTMENTS
        // ============================================================

        Schema::create('appointment', function (Blueprint $table) {
            $table->increments('appointment_id');
            $table->unsignedInteger('payment_id')->nullable();
            $table->unsignedInteger('client_id');
            $table->unsignedInteger('professional_id');
            $table->unsignedInteger('worker_schedule_id');
            $table->unsignedInteger('appointment_status_id');
            $table->unsignedInteger('service_id');
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('payment_id')->references('payment_id')->on('payment');
            $table->foreign('client_id')->references('person_id')->on('client');
            $table->foreign('professional_id')->references('person_id')->on('professional');
            $table->foreign('worker_schedule_id')->references('worker_schedule_id')->on('worker_schedule');
            $table->foreign('appointment_status_id')->references('appointment_status_id')->on('appointment_status');
            $table->foreign('service_id')->references('service_id')->on('service');
        });

        Schema::create('appointment_report', function (Blueprint $table) {
            $table->increments('appointment_report_id');
            $table->unsignedInteger('appointment_id');
            $table->string('file', 255)->nullable();
            $table->string('sign', 255)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->useCurrent();
            $table->foreign('appointment_id')->references('appointment_id')->on('appointment');
        });
    }

    public function down(): void
    {
        // Eliminar en orden inverso para respetar las FK
        Schema::dropIfExists('appointment_report');
        Schema::dropIfExists('appointment');
        Schema::dropIfExists('receipt');
        Schema::dropIfExists('payment');
        Schema::dropIfExists('payment_data');
        Schema::dropIfExists('worker_schedule');
        Schema::dropIfExists('schedule');
        Schema::dropIfExists('professional_service');
        Schema::dropIfExists('identification');
        Schema::dropIfExists('address');
        Schema::dropIfExists('phone');
        Schema::dropIfExists('staff');
        Schema::dropIfExists('professional');
        Schema::dropIfExists('client');
        Schema::dropIfExists('person');
        Schema::dropIfExists('user_account');
        Schema::dropIfExists('city');
        Schema::dropIfExists('state');
        Schema::dropIfExists('country');
        Schema::dropIfExists('service');
        Schema::dropIfExists('appointment_status');
        Schema::dropIfExists('receipt_status');
        Schema::dropIfExists('payment_status');
        Schema::dropIfExists('education');
        Schema::dropIfExists('marital_status');
        Schema::dropIfExists('occupation');
        Schema::dropIfExists('gender');
        Schema::dropIfExists('user_account_status');
        Schema::dropIfExists('role');
    }
};