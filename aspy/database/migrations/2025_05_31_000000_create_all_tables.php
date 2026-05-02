<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ============================================================
        // TABLAS BASE
        // ============================================================
 
        Schema::create('role', function (Blueprint $table) {
            $table->increments('role_id');
            $table->string('name', 100)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
        });
 
        Schema::create('user_account_status', function (Blueprint $table) {
            $table->increments('user_account_status_id');
            $table->string('name', 100)->nullable();
        });
 
        Schema::create('gender', function (Blueprint $table) {
            $table->increments('gender_id');
            $table->string('name', 50)->nullable();
        });
 
        Schema::create('occupation', function (Blueprint $table) {
            $table->increments('occupation_id');
            $table->string('name', 100)->nullable();
        });
 
        Schema::create('marital_status', function (Blueprint $table) {
            $table->increments('marital_status_id');
            $table->string('name', 100)->nullable();
        });
 
        Schema::create('education', function (Blueprint $table) {
            $table->increments('education_id');
            $table->string('name', 100)->nullable();
        });
 
        Schema::create('payment_status', function (Blueprint $table) {
            $table->increments('payment_status_id');
            $table->string('name', 100)->nullable();
        });
 
        Schema::create('receipt_status', function (Blueprint $table) {
            $table->increments('receipt_status_id');
            $table->string('name', 100)->nullable();
        });
 
        Schema::create('appointment_status', function (Blueprint $table) {
            $table->increments('appointment_status_id');
            $table->string('name', 100)->nullable();
        });
 
        Schema::create('service', function (Blueprint $table) {
            $table->increments('service_id');
            $table->string('name', 150)->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
        });
 
        // ============================================================
        // GEOGRAFÍA
        // ============================================================
 
        Schema::create('country', function (Blueprint $table) {
            $table->increments('country_id');
            $table->string('name', 100)->nullable();
            $table->string('phone_code', 10)->nullable();
        });
 
        Schema::create('state', function (Blueprint $table) {
            $table->increments('state_id');
            $table->unsignedInteger('country_id')->nullable();
            $table->string('name', 100)->nullable();
            $table->foreign('country_id')->references('country_id')->on('country');
        });
 
        Schema::create('city', function (Blueprint $table) {
            $table->increments('city_id');
            $table->unsignedInteger('state_id')->nullable();
            $table->string('name', 100)->nullable();
            $table->foreign('state_id')->references('state_id')->on('state');
        });
 
        // ============================================================
        // USER ACCOUNT
        // ============================================================
 
        Schema::create('user_account', function (Blueprint $table) {
            $table->increments('user_account_id');
            $table->unsignedInteger('role_id')->nullable();
            $table->unsignedInteger('status_id')->nullable();
            $table->string('email', 150)->unique();
            $table->string('password_hash', 255)->nullable();
            $table->timestamp('last_login')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('role_id')->references('role_id')->on('role');
            $table->foreign('status_id')->references('user_account_status_id')->on('user_account_status');
        });
 
        // ============================================================
        // PERSON
        // ============================================================
 
        Schema::create('person', function (Blueprint $table) {
            $table->increments('person_id');
            $table->unsignedInteger('user_id')->nullable();
            $table->unsignedInteger('gender_id')->nullable();
            $table->unsignedInteger('occupation_id')->nullable();
            $table->unsignedInteger('marital_status_id')->nullable();
            $table->unsignedInteger('education_id')->nullable();
            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->date('birthdate')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('user_id')->references('user_account_id')->on('user_account');
            $table->foreign('gender_id')->references('gender_id')->on('gender');
            $table->foreign('occupation_id')->references('occupation_id')->on('occupation');
            $table->foreign('marital_status_id')->references('marital_status_id')->on('marital_status');
            $table->foreign('education_id')->references('education_id')->on('education');
        });
 
        // ============================================================
        // SUBTIPOS
        // ============================================================
 
        Schema::create('client', function (Blueprint $table) {
            $table->unsignedInteger('person_id')->primary();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('person_id')->references('person_id')->on('person');
        });
 
        Schema::create('professional', function (Blueprint $table) {
            $table->unsignedInteger('person_id')->primary();
            $table->string('specialty', 150)->nullable();
            $table->string('title', 150)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('person_id')->references('person_id')->on('person');
        });
 
        Schema::create('staff', function (Blueprint $table) {
            $table->unsignedInteger('person_id')->primary();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('person_id')->references('person_id')->on('person');
        });
 
        // ============================================================
        // CONTACTO
        // ============================================================
 
        Schema::create('phone', function (Blueprint $table) {
            $table->increments('phone_id');
            $table->unsignedInteger('person_id')->nullable();
            $table->string('number', 30)->nullable();
            $table->string('type', 50)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('person_id')->references('person_id')->on('person');
        });
 
        Schema::create('address', function (Blueprint $table) {
            $table->increments('address_id');
            $table->unsignedInteger('person_id')->nullable();
            $table->string('type', 50)->nullable();
            $table->unsignedInteger('country_id')->nullable();
            $table->unsignedInteger('state_id')->nullable();
            $table->unsignedInteger('city_id')->nullable();
            $table->string('primary_address', 255)->nullable();
            $table->string('secondary_address', 255)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('person_id')->references('person_id')->on('person');
            $table->foreign('country_id')->references('country_id')->on('country');
            $table->foreign('state_id')->references('state_id')->on('state');
            $table->foreign('city_id')->references('city_id')->on('city');
        });
 
        Schema::create('identification', function (Blueprint $table) {
            $table->increments('identification_id');
            $table->unsignedInteger('person_id')->nullable();
            $table->string('type', 50)->nullable();
            $table->string('number', 50)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('person_id')->references('person_id')->on('person');
        });
 
        // ============================================================
        // PROFESSIONAL SERVICE
        // ============================================================
 
        Schema::create('professional_service', function (Blueprint $table) {
            $table->increments('professional_service_id');
            $table->unsignedInteger('service_id')->nullable();
            $table->unsignedInteger('professional_id')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('service_id')->references('service_id')->on('service');
            $table->foreign('professional_id')->references('person_id')->on('professional');
        });
 
        // ============================================================
        // SCHEDULE
        // ============================================================
 
        Schema::create('schedule', function (Blueprint $table) {
            $table->increments('schedule_id');
            $table->date('date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('name', 150)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
        });
 
        Schema::create('worker_schedule', function (Blueprint $table) {
            $table->increments('worker_schedule_id');
            $table->unsignedInteger('schedule_id')->nullable();
            $table->unsignedInteger('professional_id')->nullable();
            $table->boolean('is_available')->default(true);
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('schedule_id')->references('schedule_id')->on('schedule');
            $table->foreign('professional_id')->references('person_id')->on('professional');
        });
 
        // ============================================================
        // PAYMENT
        // ============================================================
 
        Schema::create('payment_data', function (Blueprint $table) {
            $table->increments('payment_data_id');
            $table->unsignedInteger('client_id')->nullable();
            $table->string('type', 50)->nullable();
            $table->string('file', 255)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('client_id')->references('person_id')->on('client');
        });
 
        Schema::create('payment', function (Blueprint $table) {
            $table->increments('payment_id');
            $table->unsignedInteger('client_id')->nullable();
            $table->unsignedInteger('service_id')->nullable();
            $table->unsignedInteger('payment_data_id')->nullable();
            $table->unsignedInteger('payment_status_id')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('client_id')->references('person_id')->on('client');
            $table->foreign('service_id')->references('service_id')->on('service');
            $table->foreign('payment_data_id')->references('payment_data_id')->on('payment_data');
            $table->foreign('payment_status_id')->references('payment_status_id')->on('payment_status');
        });
 
        Schema::create('receipt', function (Blueprint $table) {
            $table->increments('receipt_id');
            $table->unsignedInteger('payment_id')->nullable();
            $table->unsignedInteger('receipt_status_id')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('payment_id')->references('payment_id')->on('payment');
            $table->foreign('receipt_status_id')->references('receipt_status_id')->on('receipt_status');
        });
 
        // ============================================================
        // APPOINTMENTS
        // ============================================================
 
        Schema::create('appointment', function (Blueprint $table) {
            $table->increments('appointment_id');
            $table->unsignedInteger('payment_id')->nullable();
            $table->unsignedInteger('client_id')->nullable();
            $table->unsignedInteger('professional_id')->nullable();
            $table->unsignedInteger('worker_schedule_id')->nullable();
            $table->unsignedInteger('appointment_status_id')->nullable();
            $table->unsignedInteger('service_id')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('payment_id')->references('payment_id')->on('payment');
            $table->foreign('client_id')->references('person_id')->on('client');
            $table->foreign('professional_id')->references('person_id')->on('professional');
            $table->foreign('worker_schedule_id')->references('worker_schedule_id')->on('worker_schedule');
            $table->foreign('appointment_status_id')->references('appointment_status_id')->on('appointment_status');
            $table->foreign('service_id')->references('service_id')->on('service');
        });
 
        Schema::create('appointment_report', function (Blueprint $table) {
            $table->increments('appointment_report_id');
            $table->unsignedInteger('appointment_id')->nullable();
            $table->string('file', 255)->nullable();
            $table->string('sign', 255)->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('modified_by')->nullable();
            $table->timestamp('creation_date')->nullable();
            $table->timestamp('modification_date')->nullable();
            $table->foreign('appointment_id')->references('appointment_id')->on('appointment');
        });
 
        // ============================================================
        // ÍNDICES
        // ============================================================
 
        Schema::table('person', function (Blueprint $table) {
            $table->index('user_id', 'idx_person_user_id');
        });
 
        Schema::table('appointment', function (Blueprint $table) {
            $table->index('client_id',          'idx_appointment_client_id');
            $table->index('professional_id',    'idx_appointment_professional_id');
            $table->index('payment_id',         'idx_appointment_payment_id');
            $table->index('worker_schedule_id', 'idx_appointment_worker_schedule_id');
            $table->index('service_id',         'idx_appointment_service_id');
            $table->index(['professional_id', 'appointment_status_id'], 'idx_appointment_professional_status');
        });
 
        Schema::table('payment', function (Blueprint $table) {
            $table->index('client_id',       'idx_payment_client_id');
            $table->index('service_id',      'idx_payment_service_id');
            $table->index('payment_data_id', 'idx_payment_payment_data_id');
        });
 
        Schema::table('receipt', function (Blueprint $table) {
            $table->index('payment_id', 'idx_receipt_payment_id');
        });
 
        Schema::table('worker_schedule', function (Blueprint $table) {
            $table->index('professional_id', 'idx_worker_schedule_professional_id');
            $table->index('schedule_id',     'idx_worker_schedule_schedule_id');
            $table->index('is_available',    'idx_worker_schedule_is_available');
            $table->index(['professional_id', 'is_available'], 'idx_worker_schedule_professional_available');
        });
 
        Schema::table('schedule', function (Blueprint $table) {
            $table->index(['date', 'start_time', 'end_time'], 'idx_schedule_date_times');
        });
 
        Schema::table('professional_service', function (Blueprint $table) {
            $table->index('professional_id', 'idx_professional_service_professional_id');
            $table->index('service_id',      'idx_professional_service_service_id');
        });
 
        Schema::table('phone', function (Blueprint $table) {
            $table->index('person_id', 'idx_phone_person_id');
        });
 
        Schema::table('address', function (Blueprint $table) {
            $table->index('person_id', 'idx_address_person_id');
        });
 
        Schema::table('identification', function (Blueprint $table) {
            $table->index('person_id', 'idx_identification_person_id');
        });
 
        Schema::table('payment_data', function (Blueprint $table) {
            $table->index('client_id', 'idx_payment_data_client_id');
        });
 
        Schema::table('appointment_report', function (Blueprint $table) {
            $table->index('appointment_id', 'idx_appointment_report_appointment_id');
        });
 
        Schema::table('professional', function (Blueprint $table) {
            $table->index('person_id', 'idx_professional_person_id');
        });
 
        Schema::table('client', function (Blueprint $table) {
            $table->index('person_id', 'idx_client_person_id');
        });
 
        Schema::table('staff', function (Blueprint $table) {
            $table->index('person_id', 'idx_staff_person_id');
        });
    }
 
    public function down(): void
    {
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