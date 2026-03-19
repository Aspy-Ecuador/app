<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================================
        // ROLES
        // ============================================================
        DB::table('role')->insert([
            ['name' => 'ADMIN',        'creation_date' => now(), 'modification_date' => now()],
            ['name' => 'PROFESSIONAL', 'creation_date' => now(), 'modification_date' => now()],
            ['name' => 'CLIENT',       'creation_date' => now(), 'modification_date' => now()],
            ['name' => 'SECRETARY',    'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // STATUS DE USUARIO
        // ============================================================
        DB::table('user_account_status')->insert([
            ['name' => 'ACTIVE'],
            ['name' => 'INACTIVE'],
        ]);

        // ============================================================
        // CATÁLOGOS
        // ============================================================
        DB::table('gender')->insert([
            ['name' => 'MALE'],
            ['name' => 'FEMALE'],
        ]);

        DB::table('occupation')->insert([
            ['name' => 'ENGINEER'],
            ['name' => 'DOCTOR'],
        ]);

        DB::table('marital_status')->insert([
            ['name' => 'SINGLE'],
            ['name' => 'MARRIED'],
        ]);

        DB::table('education')->insert([
            ['name' => 'UNIVERSITY'],
        ]);

        DB::table('payment_status')->insert([
            ['name' => 'PAID'],
            ['name' => 'PENDING'],
        ]);

        DB::table('receipt_status')->insert([
            ['name' => 'GENERATED'],
            ['name' => 'PENDING'],
        ]);

        DB::table('appointment_status')->insert([
            ['name' => 'SAVE'],
            ['name' => 'SCHEDULED'],
            ['name' => 'COMPLETED'],
            ['name' => 'MISSING'],
        ]);

        // ============================================================
        // SERVICIOS
        // ============================================================
        DB::table('service')->insert([
            ['name' => 'Consulta General', 'price' => 25.00, 'creation_date' => now(), 'modification_date' => now()],
            ['name' => 'Terapia',          'price' => 40.00, 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // GEOGRAFÍA
        // ============================================================
        DB::table('country')->insert([
            ['name' => 'Ecuador', 'phone_code' => '+593'],
        ]);

        DB::table('state')->insert([
            ['country_id' => 1, 'name' => 'Guayas'],
        ]);

        DB::table('city')->insert([
            ['state_id' => 1, 'name' => 'Guayaquil'],
        ]);

        // ============================================================
        // CUENTAS DE USUARIO
        // ============================================================
        DB::table('user_account')->insert([
            ['role_id' => 1, 'status_id' => 1, 'email' => 'admin@aspy.com',  'password_hash' => bcrypt('admin'),  'creation_date' => now(), 'modification_date' => now()],
            ['role_id' => 2, 'status_id' => 1, 'email' => 'prof1@aspy.com',  'password_hash' => bcrypt('prof1'),  'creation_date' => now(), 'modification_date' => now()],
            ['role_id' => 2, 'status_id' => 1, 'email' => 'prof2@aspy.com',  'password_hash' => bcrypt('prof2'),  'creation_date' => now(), 'modification_date' => now()],
            ['role_id' => 3, 'status_id' => 1, 'email' => 'client@aspy.com', 'password_hash' => bcrypt('client'), 'creation_date' => now(), 'modification_date' => now()],
            ['role_id' => 4, 'status_id' => 1, 'email' => 'staff@aspy.com',  'password_hash' => bcrypt('staff'),  'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // PERSONAS
        // ============================================================
        DB::table('person')->insert([
            ['user_id' => 1, 'gender_id' => 1, 'occupation_id' => 1, 'marital_status_id' => 1, 'education_id' => 1, 'first_name' => 'Carlos', 'last_name' => 'Flores',    'birthdate' => '1990-01-01', 'creation_date' => now(), 'modification_date' => now()],
            ['user_id' => 2, 'gender_id' => 1, 'occupation_id' => 2, 'marital_status_id' => 1, 'education_id' => 1, 'first_name' => 'Juan',   'last_name' => 'Doctor',    'birthdate' => '1985-05-10', 'creation_date' => now(), 'modification_date' => now()],
            ['user_id' => 3, 'gender_id' => 2, 'occupation_id' => 2, 'marital_status_id' => 2, 'education_id' => 1, 'first_name' => 'Maria',  'last_name' => 'Doctor',    'birthdate' => '1988-03-20', 'creation_date' => now(), 'modification_date' => now()],
            ['user_id' => 4, 'gender_id' => 1, 'occupation_id' => 1, 'marital_status_id' => 1, 'education_id' => 1, 'first_name' => 'Carlos', 'last_name' => 'Cliente',   'birthdate' => '2000-07-15', 'creation_date' => now(), 'modification_date' => now()],
            ['user_id' => 5, 'gender_id' => 2, 'occupation_id' => 1, 'marital_status_id' => 1, 'education_id' => 1, 'first_name' => 'Ana',    'last_name' => 'Secretaria','birthdate' => '1995-09-09', 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // SUBTIPOS DE PERSONA
        // ============================================================
        DB::table('client')->insert([
            ['person_id' => 4, 'creation_date' => now(), 'modification_date' => now()],
        ]);

        DB::table('professional')->insert([
            ['person_id' => 2, 'specialty' => 'Psicología',      'title' => 'Licenciado',  'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 3, 'specialty' => 'Terapia Física',  'title' => 'Especialista','creation_date' => now(), 'modification_date' => now()],
        ]);

        DB::table('staff')->insert([
            ['person_id' => 1, 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 5, 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // TELÉFONOS
        // ============================================================
        DB::table('phone')->insert([
            ['person_id' => 1, 'number' => '0999999999', 'type' => 'mobile', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 2, 'number' => '0999999999', 'type' => 'mobile', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 3, 'number' => '0999999999', 'type' => 'mobile', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 4, 'number' => '0999999999', 'type' => 'mobile', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 5, 'number' => '0999999999', 'type' => 'mobile', 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // DIRECCIONES
        // ============================================================
        DB::table('address')->insert([
            ['person_id' => 1, 'type' => 'home', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. Principal', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 2, 'type' => 'home', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. Principal', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 3, 'type' => 'home', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. Principal', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 4, 'type' => 'home', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. Principal', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 5, 'type' => 'home', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. Principal', 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // IDENTIFICACIONES
        // ============================================================
        DB::table('identification')->insert([
            ['person_id' => 1, 'type' => 'CI', 'number' => '1234567890', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 2, 'type' => 'CI', 'number' => '1234567890', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 3, 'type' => 'CI', 'number' => '1234567890', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 4, 'type' => 'CI', 'number' => '1234567890', 'creation_date' => now(), 'modification_date' => now()],
            ['person_id' => 5, 'type' => 'CI', 'number' => '1234567890', 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // SERVICIOS POR PROFESIONAL
        // ============================================================
        DB::table('professional_service')->insert([
            ['service_id' => 1, 'professional_id' => 2, 'creation_date' => now(), 'modification_date' => now()],
            ['service_id' => 2, 'professional_id' => 3, 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // HORARIOS
        // ============================================================
        $today     = Carbon::today();
        $lastMonth = Carbon::today()->subMonth();

        DB::table('schedule')->insert([
            // Hoy
            ['date' => $today,     'start_time' => '09:00:00', 'end_time' => '10:00:00', 'name' => 'Horario Hoy 1',    'creation_date' => now(), 'modification_date' => now()],
            ['date' => $today,     'start_time' => '10:00:00', 'end_time' => '11:00:00', 'name' => 'Horario Hoy 2',    'creation_date' => now(), 'modification_date' => now()],
            // Mes pasado
            ['date' => $lastMonth, 'start_time' => '09:00:00', 'end_time' => '10:00:00', 'name' => 'Horario Pasado 1', 'creation_date' => now(), 'modification_date' => now()],
            ['date' => $lastMonth, 'start_time' => '10:00:00', 'end_time' => '11:00:00', 'name' => 'Horario Pasado 2', 'creation_date' => now(), 'modification_date' => now()],
        ]);

        DB::table('worker_schedule')->insert([
            ['schedule_id' => 1, 'professional_id' => 2, 'is_available' => true, 'creation_date' => now(), 'modification_date' => now()],
            ['schedule_id' => 2, 'professional_id' => 3, 'is_available' => true, 'creation_date' => now(), 'modification_date' => now()],
            ['schedule_id' => 3, 'professional_id' => 2, 'is_available' => true, 'creation_date' => now(), 'modification_date' => now()],
            ['schedule_id' => 4, 'professional_id' => 3, 'is_available' => true, 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // PAGOS
        // ============================================================
        DB::table('payment_data')->insert([
            ['client_id' => 4, 'type' => 'TRANSFER', 'creation_date' => now(), 'modification_date' => now()],
        ]);

        DB::table('payment')->insert([
            ['client_id' => 4, 'service_id' => 1, 'payment_data_id' => 1, 'payment_status_id' => 1, 'creation_date' => now(), 'modification_date' => now()],
            ['client_id' => 4, 'service_id' => 2, 'payment_data_id' => 1, 'payment_status_id' => 2, 'creation_date' => now(), 'modification_date' => now()],
        ]);

        DB::table('receipt')->insert([
            ['payment_id' => 1, 'receipt_status_id' => 1, 'creation_date' => now(), 'modification_date' => now()],
            ['payment_id' => 2, 'receipt_status_id' => 1, 'creation_date' => now(), 'modification_date' => now()],
        ]);

        // ============================================================
        // CITAS
        // ============================================================
        DB::table('appointment')->insert([
            // Citas de hoy
            ['payment_id' => 1, 'client_id' => 4, 'professional_id' => 2, 'worker_schedule_id' => 1, 'appointment_status_id' => 1, 'service_id' => 1, 'creation_date' => now(),       'modification_date' => now()],
            ['payment_id' => 2, 'client_id' => 4, 'professional_id' => 3, 'worker_schedule_id' => 2, 'appointment_status_id' => 1, 'service_id' => 2, 'creation_date' => now(),       'modification_date' => now()],
            // Citas del mes pasado
            ['payment_id' => 1, 'client_id' => 4, 'professional_id' => 2, 'worker_schedule_id' => 3, 'appointment_status_id' => 2, 'service_id' => 1, 'creation_date' => $lastMonth, 'modification_date' => now()],
            ['payment_id' => 2, 'client_id' => 4, 'professional_id' => 3, 'worker_schedule_id' => 4, 'appointment_status_id' => 2, 'service_id' => 2, 'creation_date' => $lastMonth, 'modification_date' => now()],
        ]);

        // ============================================================
        // REPORTES DE CITAS
        // ============================================================
        DB::table('appointment_report')->insert([
            ['appointment_id' => 1, 'file' => 'reporte1.pdf', 'sign' => 'firma1', 'creation_date' => now(), 'modification_date' => now()],
            ['appointment_id' => 3, 'file' => 'reporte2.pdf', 'sign' => 'firma2', 'creation_date' => now(), 'modification_date' => now()],
        ]);
    }
}