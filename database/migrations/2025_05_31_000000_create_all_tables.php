<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllTables extends Migration
{
    public function up()
    {
        Schema::create('role', function (Blueprint $table) {
            $table->id('role_id');
            $table->string('name')->unique();
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('gender', function (Blueprint $table) {
            $table->id('gender_id');
            $table->string('name');
        });

        Schema::create('occupation', function (Blueprint $table) {
            $table->id('occupation_id');
            $table->string('name');
        });

        Schema::create('marital_status', function (Blueprint $table) {
            $table->id('marital_status_id');
            $table->string('name');
        });

        Schema::create('education', function (Blueprint $table) {
            $table->id('education_id');
            $table->string('name');
        });

        Schema::create('country', function (Blueprint $table) {
            $table->id('country_id');
            $table->string('name');
            $table->string('phone_code', 4);
        });

        Schema::create('state', function (Blueprint $table) {
            $table->id('state_id');
            $table->string('name');
            $table->foreignId('country_id')->constrained('country', 'country_id');
        });

        Schema::create('city', function (Blueprint $table) {
            $table->id('city_id');
            $table->string('name');
            $table->foreignId('state_id')->constrained('state', 'state_id');
        });

        Schema::create('aga', function (Blueprint $table) {
            $table->id('aga_id');
            $table->string('name');
        });

        Schema::create('user_account_status', function (Blueprint $table) {
            $table->id('status_id');
            $table->string('name');
        });

        Schema::create('appointment_status', function (Blueprint $table) {
            $table->id('status_id');
            $table->string('name');
        });

        Schema::create('payment_status', function (Blueprint $table) {
            $table->id('status_id');
            $table->string('name');
        });

        Schema::create('user_account', function (Blueprint $table) {
            $table->id('user_id');
            $table->foreignId('role_id')->constrained('role', 'role_id');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->foreignId('status')->constrained('user_account_status', 'status_id');
            $table->timestamp('last_login')->nullable();
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('person', function (Blueprint $table) {
            $table->id('person_id');
            $table->foreignId('user_id')->unique()->constrained('user_account', 'user_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->date('birthdate');
            $table->string('gender');
            $table->string('occupation');
            $table->string('marital_status');
            $table->string('education');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('client', function (Blueprint $table) {
            $table->primary('person_id');
            $table->foreignId('person_id')->constrained('person', 'person_id');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('staff', function (Blueprint $table) {
            $table->primary('person_id');
            $table->foreignId('person_id')->constrained('person', 'person_id');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('professional', function (Blueprint $table) {
            $table->primary('person_id');
            $table->foreignId('person_id')->constrained('person', 'person_id');
            $table->string('specialty');
            $table->string('title', 50);
            $table->text('about')->nullable();
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('identification', function (Blueprint $table) {
            $table->id('identification_id');
            $table->foreignId('person_id')->constrained('person', 'person_id');
            $table->string('type', 50);
            $table->string('number', 13)->unique();
            $table->timestamp('due_date')->nullable();
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('address', function (Blueprint $table) {
            $table->id('address_id');
            $table->foreignId('person_id')->constrained('person', 'person_id');
            $table->string('type', 50);
            $table->foreignId('country')->constrained('country', 'country_id');
            $table->foreignId('province')->constrained('state', 'state_id');
            $table->foreignId('city')->constrained('city', 'city_id');
            $table->text('primary_address');
            $table->text('secondary_address')->nullable();
            $table->foreignId('aga')->constrained('aga', 'aga_id');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('phone', function (Blueprint $table) {
            $table->id('phone_id');
            $table->foreignId('person_id')->constrained('person', 'person_id');
            $table->string('type', 50);
            $table->string('number', 10);
            $table->string('name')->nullable();
            $table->string('relationship', 50);
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('medical_profile', function (Blueprint $table) {
            $table->id('medical_profile_id');
            $table->foreignId('person_id')->constrained('client', 'person_id');
            $table->string('diagnose')->unique();
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('schedule', function (Blueprint $table) {
            $table->id('schedule_id');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('name')->nullable();
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('worker_schedule', function (Blueprint $table) {
            $table->id('worker_schedule_id');
            $table->foreignId('schedule_id')->constrained('schedule', 'schedule_id');
            $table->foreignId('person_id')->constrained('person', 'person_id');
            $table->boolean('is_available');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
            $table->unique(['schedule_id', 'person_id']);
        });

        Schema::create('discount', function (Blueprint $table) {
            $table->id('discount_id');
            $table->string('name')->unique();
            $table->integer('discount');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('service', function (Blueprint $table) {
            $table->id('service_id');
            $table->string('name')->unique();
            $table->decimal('price', 10, 2);
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('professional_service', function (Blueprint $table) {
            $table->id('professional_service_id');
            $table->foreignId('service_id')->constrained('service', 'service_id');
            $table->foreignId('person_id')->constrained('professional', 'person_id');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('payment_data', function (Blueprint $table) {
            $table->id('payment_data_id');
            $table->string('type');
            $table->integer('number');
            $table->string('file')->unique();
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('payment', function (Blueprint $table) {
            $table->id('payment_id');
            $table->foreignId('person_id')->constrained('client', 'person_id');
            $table->foreignId('service_id')->constrained('service', 'service_id');
            $table->foreignId('discount_id')->nullable()->constrained('discount', 'discount_id');
            $table->foreignId('payment_data_id')->constrained('payment_data', 'payment_data_id');
            $table->decimal('service_price', 10, 2);
            $table->integer('discount_percentage')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->foreignId('status')->constrained('payment_status', 'status_id');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('receipt', function (Blueprint $table) {
            $table->id('receipt_id');
            $table->foreignId('payment_id')->unique()->constrained('payment', 'payment_id');
            $table->string('status');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('appointment', function (Blueprint $table) {
            $table->id('appointment_id');
            $table->foreignId('payment_id')->constrained('payment', 'payment_id');
            $table->foreignId('scheduled_by')->constrained('person', 'person_id');
            $table->foreignId('worker_schedule_id')->unique()->constrained('worker_schedule', 'worker_schedule_id');
            $table->foreignId('tracking_appointment')->nullable()->unique()->constrained('appointment', 'appointment_id');
            $table->foreignId('status')->constrained('appointment_status', 'status_id');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });

        Schema::create('appointment_report', function (Blueprint $table) {
            $table->id('appointment_report_id');
            $table->foreignId('appointment_id')->unique()->constrained('appointment', 'appointment_id');
            $table->text('comments');
            $table->string('sign');
            $table->string('created_by')->default('system');
            $table->string('modified_by')->nullable();
            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('modification_date')->nullable();
        });
    }

    public function down()
    {
        // Elimina tablas en orden inverso para evitar conflictos FK
        Schema::dropIfExists('appointment_report');
        Schema::dropIfExists('appointment');
        Schema::dropIfExists('receipt');
        Schema::dropIfExists('payment');
        Schema::dropIfExists('payment_data');
        Schema::dropIfExists('professional_service');
        Schema::dropIfExists('service');
        Schema::dropIfExists('discount');
        Schema::dropIfExists('worker_schedule');
        Schema::dropIfExists('schedule');
        Schema::dropIfExists('medical_profile');
        Schema::dropIfExists('phone');
        Schema::dropIfExists('address');
        Schema::dropIfExists('identification');
        Schema::dropIfExists('professional');
        Schema::dropIfExists('staff');
        Schema::dropIfExists('client');
        Schema::dropIfExists('person');
        Schema::dropIfExists('user_account');
        Schema::dropIfExists('payment_status');
        Schema::dropIfExists('appointment_status');
        Schema::dropIfExists('user_account_status');
        Schema::dropIfExists('aga');
        Schema::dropIfExists('city');
        Schema::dropIfExists('state');
        Schema::dropIfExists('country');
        Schema::dropIfExists('education');
        Schema::dropIfExists('marital_status');
        Schema::dropIfExists('occupation');
        Schema::dropIfExists('gender');
        Schema::dropIfExists('role');
    }
}
