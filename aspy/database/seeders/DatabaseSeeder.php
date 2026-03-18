<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // $this->seedCatalogues();
        // $this->seedLocation();
        // $this->seedUsers();
        $this->seedPersons();
        $this->seedPersonSubtypes();
        $this->seedContactData();
        $this->seedServicesAndProfessionalServices();
        $this->seedSchedulesAndWorkerSchedules();
        $this->seedPaymentsAndAppointments();
    }

    // =========================================================================
    // CATÁLOGOS
    // =========================================================================
    private function seedCatalogues(): void
    {
        DB::table('role')->insert([
            ['name' => 'Admin'],
            ['name' => 'Professional'],
            ['name' => 'Client'],
            ['name' => 'Staff'],
        ]);
        // role_id: 1=Admin, 2=Professional, 3=Client, 4=Staff

        DB::table('user_account_status')->insert([
            ['name' => 'Active'],
            ['name' => 'Inactive'],
        ]);
        // status_id: 1=Active, 2=Inactive

        DB::table('appointment_status')->insert([
            ['name' => 'Scheduled'],
            ['name' => 'Completed'],
            ['name' => 'Cancelled'],
        ]);
        // status_id: 1=Scheduled, 2=Completed, 3=Cancelled

        DB::table('payment_status')->insert([
            ['name' => 'Pending'],
            ['name' => 'Paid'],
            ['name' => 'Failed'],
        ]);
        // status_id: 1=Pending, 2=Paid, 3=Failed

        DB::table('gender')->insert([
            ['name' => 'Masculino'],
            ['name' => 'Femenino'],
        ]);
        // gender_id: 1=Masculino, 2=Femenino

        DB::table('occupation')->insert([
            ['name' => 'Doctor'],
            ['name' => 'Enfermero'],
            ['name' => 'Ingeniero'],
            ['name' => 'Estudiante'],
        ]);
        // occupation_id: 1=Doctor, 2=Enfermero, 3=Ingeniero, 4=Estudiante

        DB::table('marital_status')->insert([
            ['name' => 'Soltero'],
            ['name' => 'Casado'],
            ['name' => 'Divorciado'],
        ]);
        // marital_status_id: 1=Soltero, 2=Casado, 3=Divorciado

        DB::table('education')->insert([
            ['name' => 'Secundaria'],
            ['name' => 'Pregrado'],
            ['name' => 'Postgrado'],
        ]);
        // education_id: 1=Secundaria, 2=Pregrado, 3=Postgrado

        DB::table('aga')->insert([
            ['name' => 'Zona 1: Esmeraldas, Imbabura, Carchi, Sucumbíos'],
            ['name' => 'Zona 2: Pichincha (excepto Quito), Napo, Orellana'],
            ['name' => 'Zona 3: Cotopaxi, Tungurahua, Chimborazo, Pastaza'],
            ['name' => 'Zona 4: Manabí, Santo Domingo de los Tsáchilas'],
            ['name' => 'Zona 5: Santa Elena, Guayas (excepto Guayaquil, Samborondón y Durán), Bolívar, Los Ríos, Galápagos'],
            ['name' => 'Zona 6: Cañar, Azuay, Morona Santiago'],
            ['name' => 'Zona 7: El Oro, Loja, Zamora Chinchipe'],
            ['name' => 'Zona 8: Guayaquil, Samborondón y Durán'],
            ['name' => 'Zona 9: Distrito Metropolitano de Quito'],
        ]);
        // aga_id: 1–9
    }

    // =========================================================================
    // UBICACIÓN (país, provincia, ciudad)
    // =========================================================================
    private function seedLocation(): void
    {
        DB::table('country')->insert([
            ['name' => 'Ecuador', 'phone_code' => '+593'],
        ]);
        // country_id: 1=Ecuador

        DB::table('state')->insert([
            ['name' => 'Pichincha', 'country_id' => 1],
        ]);
        // state_id: 1=Pichincha

        DB::table('city')->insert([
            ['name' => 'Quito', 'state_id' => 1],
        ]);
        // city_id: 1=Quito
    }

    // =========================================================================
    // USUARIOS
    // =========================================================================
    private function seedUsers(): void
    {
        DB::table('user_account')->insert([
            ['role_id' => 1, 'email' => 'admin@aspy.com',  'password_hash' => bcrypt('admin'),  'status' => 1, 'created_by' => 'system'],
            ['role_id' => 2, 'email' => 'prof1@aspy.com',  'password_hash' => bcrypt('prof1'),  'status' => 1, 'created_by' => 'system'],
            ['role_id' => 3, 'email' => 'client@aspy.com', 'password_hash' => bcrypt('client'), 'status' => 1, 'created_by' => 'system'],
            ['role_id' => 4, 'email' => 'staff@aspy.com',  'password_hash' => bcrypt('staff'),  'status' => 1, 'created_by' => 'system'],
            ['role_id' => 2, 'email' => 'prof2@aspy.com',  'password_hash' => bcrypt('prof2'),  'status' => 1, 'created_by' => 'system'],
            ['role_id' => 2, 'email' => 'prof3@aspy.com',  'password_hash' => bcrypt('prof3'),  'status' => 1, 'created_by' => 'system'],
        ]);
        // user_id: 1=Admin, 2=Juan(prof1), 3=María(client), 4=Luisa(staff), 5=Carlos(prof2), 6=Sofia(prof3)
    }

    // =========================================================================
    // PERSONAS
    // =========================================================================
    private function seedPersons(): void
    {
        DB::table('person')->insert([
            // Admin
            [
                'user_id' => 1,
                'first_name' => 'Administrador',
                'last_name' => null,
                'birthdate' => '1980-01-01',
                'gender_id' => 1,
                'occupation_id' => 3,
                'marital_status_id' => 2,
                'education_id' => 3,
                'created_by' => 'system',
            ],
            // Prof 1 — Juan Carlos (Cardiología)
            [
                'user_id' => 2,
                'first_name' => 'Juan',
                'last_name' => 'Carlos',
                'birthdate' => '1975-05-10',
                'gender_id' => 1,
                'occupation_id' => 1,
                'marital_status_id' => 2,
                'education_id' => 3,
                'created_by' => 'system',
            ],
            // Cliente — María
            [
                'user_id' => 3,
                'first_name' => 'María',
                'last_name' => null,
                'birthdate' => '1990-12-20',
                'gender_id' => 2,
                'occupation_id' => 4,
                'marital_status_id' => 1,
                'education_id' => 2,
                'created_by' => 'system',
            ],
            // Staff — Luisa
            [
                'user_id' => 4,
                'first_name' => 'Luisa',
                'last_name' => null,
                'birthdate' => '1985-07-15',
                'gender_id' => 2,
                'occupation_id' => 2,
                'marital_status_id' => 1,
                'education_id' => 2,
                'created_by' => 'system',
            ],
            // Prof 2 — Carlos Andres (Neurología)
            [
                'user_id' => 5,
                'first_name' => 'Carlos',
                'last_name' => 'Andres',
                'birthdate' => '1980-03-22',
                'gender_id' => 1,
                'occupation_id' => 1,
                'marital_status_id' => 1,
                'education_id' => 3,
                'created_by' => 'system',
            ],
            // Prof 3 — Sofia (Pediatría)
            [
                'user_id' => 6,
                'first_name' => 'Sofia',
                'last_name' => null,
                'birthdate' => '1988-09-05',
                'gender_id' => 2,
                'occupation_id' => 1,
                'marital_status_id' => 2,
                'education_id' => 3,
                'created_by' => 'system',
            ],
        ]);
        // person_id: 1=Admin, 2=Juan, 3=María, 4=Luisa, 5=Carlos, 6=Sofia
    }

    // =========================================================================
    // SUBTIPOS DE PERSONA (client, staff, professional)
    // =========================================================================
    private function seedPersonSubtypes(): void
    {
        DB::table('staff')->insert([
            ['person_id' => 1, 'created_by' => 'system'],
            ['person_id' => 4, 'created_by' => 'system'],
        ]);

        DB::table('professional')->insert([
            [
                'person_id' => 2,
                'specialty' => 'Cardiología',
                'title' => 'Médico',
                'about' => 'Especialista en enfermedades cardiovasculares con 15 años de experiencia.',
                'created_by' => 'system',
            ],
            [
                'person_id' => 5,
                'specialty' => 'Neurología',
                'title' => 'Médico',
                'about' => 'Especialista en enfermedades del sistema nervioso con 12 años de experiencia.',
                'created_by' => 'system',
            ],
            [
                'person_id' => 6,
                'specialty' => 'Pediatría',
                'title' => 'Médico',
                'about' => 'Especialista en salud infantil y adolescente con 10 años de experiencia.',
                'created_by' => 'system',
            ],
        ]);

        DB::table('client')->insert([
            ['person_id' => 3, 'created_by' => 'system'],
        ]);
    }

    // =========================================================================
    // DATOS DE CONTACTO (identificación, dirección, teléfonos)
    // =========================================================================
    private function seedContactData(): void
    {
        // ── Identificaciones ─────────────────────────────────────────────────
        DB::table('identification')->insert([
            ['person_id' => 1, 'type' => 'Cedula', 'number' => '1700000001', 'created_by' => 'system'],
            ['person_id' => 2, 'type' => 'Cedula', 'number' => '1700000002', 'created_by' => 'system'],
            ['person_id' => 3, 'type' => 'Cedula', 'number' => '1712345678', 'created_by' => 'system'],
            ['person_id' => 4, 'type' => 'Cedula', 'number' => '1700000004', 'created_by' => 'system'],
            ['person_id' => 5, 'type' => 'Cedula', 'number' => '1700000005', 'created_by' => 'system'],
            ['person_id' => 6, 'type' => 'Cedula', 'number' => '1700000006', 'created_by' => 'system'],
        ]);

        // ── Direcciones ───────────────────────────────────────────────────────
        DB::table('address')->insert([
            ['person_id' => 1, 'type' => 'Trabajo',   'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. Amazonas N35-17',      'secondary_address' => null, 'aga_id' => 9, 'created_by' => 'system'],
            ['person_id' => 2, 'type' => 'Trabajo',   'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. 6 de Diciembre N24-55', 'secondary_address' => null, 'aga_id' => 9, 'created_by' => 'system'],
            ['person_id' => 3, 'type' => 'Domicilio', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. Siempre Viva 742',       'secondary_address' => null, 'aga_id' => 9, 'created_by' => 'system'],
            ['person_id' => 4, 'type' => 'Domicilio', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Calle Olmedo OE2-45',        'secondary_address' => null, 'aga_id' => 9, 'created_by' => 'system'],
            ['person_id' => 5, 'type' => 'Trabajo',   'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Av. República E7-126',       'secondary_address' => null, 'aga_id' => 9, 'created_by' => 'system'],
            ['person_id' => 6, 'type' => 'Domicilio', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Calle Veintimilla E8-29',    'secondary_address' => null, 'aga_id' => 9, 'created_by' => 'system'],
        ]);

        // ── Teléfonos ─────────────────────────────────────────────────────────
        DB::table('phone')->insert([
            ['person_id' => 1, 'type' => 'Personal', 'number' => '0990000001', 'name' => null, 'relationship' => 'Titular', 'created_by' => 'system'],
            ['person_id' => 2, 'type' => 'Personal', 'number' => '0990000002', 'name' => null, 'relationship' => 'Titular', 'created_by' => 'system'],
            ['person_id' => 3, 'type' => 'Personal', 'number' => '0998765432', 'name' => null, 'relationship' => 'Titular', 'created_by' => 'system'],
            ['person_id' => 4, 'type' => 'Trabajo',  'number' => '0991234567', 'name' => null, 'relationship' => 'Titular', 'created_by' => 'system'],
            ['person_id' => 5, 'type' => 'Personal', 'number' => '0990000005', 'name' => null, 'relationship' => 'Titular', 'created_by' => 'system'],
            ['person_id' => 6, 'type' => 'Personal', 'number' => '0990000006', 'name' => null, 'relationship' => 'Titular', 'created_by' => 'system'],
        ]);
    }

    // =========================================================================
    // SERVICIOS + PROFESSIONAL_SERVICE
    // =========================================================================
    private function seedServicesAndProfessionalServices(): void
    {
        DB::table('service')->insert([
            ['name' => 'Consulta General',      'price' => 50.00, 'created_by' => 'system'], // service_id: 1
            ['name' => 'Consulta Especializada', 'price' => 80.00, 'created_by' => 'system'], // service_id: 2
            ['name' => 'Consulta Neurológica',  'price' => 90.00, 'created_by' => 'system'], // service_id: 3
            ['name' => 'Consulta Pediátrica',   'price' => 60.00, 'created_by' => 'system'], // service_id: 4
            ['name' => 'Electrocardiograma',    'price' => 45.00, 'created_by' => 'system'], // service_id: 5
            ['name' => 'Resonancia Magnética',  'price' => 250.00, 'created_by' => 'system'], // service_id: 6
            ['name' => 'Examen de Laboratorio', 'price' => 35.00, 'created_by' => 'system'], // service_id: 7
            ['name' => 'Terapia Física',        'price' => 40.00, 'created_by' => 'system'], // service_id: 8
        ]);

        DB::table('professional_service')->insert([
            // Juan (Cardiología) — person_id: 2
            ['service_id' => 1, 'person_id' => 2, 'created_by' => 'system'], // Consulta General
            ['service_id' => 2, 'person_id' => 2, 'created_by' => 'system'], // Consulta Especializada
            ['service_id' => 5, 'person_id' => 2, 'created_by' => 'system'], // Electrocardiograma
            ['service_id' => 6, 'person_id' => 2, 'created_by' => 'system'], // Resonancia Magnética
            // Carlos (Neurología) — person_id: 5
            ['service_id' => 3, 'person_id' => 5, 'created_by' => 'system'], // Consulta Neurológica
            ['service_id' => 7, 'person_id' => 5, 'created_by' => 'system'], // Examen de Laboratorio
            // Sofia (Pediatría) — person_id: 6
            ['service_id' => 4, 'person_id' => 6, 'created_by' => 'system'], // Consulta Pediátrica
            ['service_id' => 7, 'person_id' => 6, 'created_by' => 'system'], // Examen de Laboratorio
            ['service_id' => 8, 'person_id' => 6, 'created_by' => 'system'], // Terapia Física
        ]);
    }

    // =========================================================================
    // SCHEDULES + WORKER_SCHEDULES
    // =========================================================================
    private function seedSchedulesAndWorkerSchedules(): void
    {
        // Columnas: [índice, fecha, start, end, nombre, person_id del profesional]
        //
        // ── 5 citas año pasado (2025) en meses distintos ──────────────────────
        // ── 13 citas mes pasado (febrero 2026) ───────────────────────────────
        $scheduleAssignments = [
            // ── Año pasado 2025 ───────────────────────────────────────────────
            [1,  '2025-02-14', '08:00:00', '09:00:00', 'Turno 2025 febrero',    2], // Juan
            [2,  '2025-04-10', '09:00:00', '10:00:00', 'Turno 2025 abril',      5], // Carlos
            [3,  '2025-06-20', '10:00:00', '11:00:00', 'Turno 2025 junio',      6], // Sofia
            [4,  '2025-09-05', '11:00:00', '12:00:00', 'Turno 2025 septiembre', 2], // Juan
            [5,  '2025-11-18', '14:00:00', '15:00:00', 'Turno 2025 noviembre',  5], // Carlos
            // ── Febrero 2026 (mes pasado) ─────────────────────────────────────
            [6,  '2026-02-02', '08:00:00', '09:00:00', 'Turno feb26 1',         2], // Juan
            [7,  '2026-02-03', '09:00:00', '10:00:00', 'Turno feb26 2',         5], // Carlos
            [8,  '2026-02-04', '10:00:00', '11:00:00', 'Turno feb26 3',         6], // Sofia
            [9,  '2026-02-05', '11:00:00', '12:00:00', 'Turno feb26 4',         2], // Juan
            [10, '2026-02-06', '14:00:00', '15:00:00', 'Turno feb26 5',         5], // Carlos
            [11, '2026-02-10', '08:00:00', '09:00:00', 'Turno feb26 6',         6], // Sofia
            [12, '2026-02-11', '09:00:00', '10:00:00', 'Turno feb26 7',         2], // Juan
            [13, '2026-02-12', '10:00:00', '11:00:00', 'Turno feb26 8',         5], // Carlos
            [14, '2026-02-13', '11:00:00', '12:00:00', 'Turno feb26 9',         6], // Sofia
            [15, '2026-02-17', '08:00:00', '09:00:00', 'Turno feb26 10',        2], // Juan
            [16, '2026-02-18', '09:00:00', '10:00:00', 'Turno feb26 11',        5], // Carlos
            [17, '2026-02-24', '14:00:00', '15:00:00', 'Turno feb26 12',        6], // Sofia
            [18, '2026-02-25', '10:00:00', '11:00:00', 'Turno feb26 13',        2], // Juan
        ];

        $scheduleRows = [];
        $workerScheduleRows = [];

        foreach ($scheduleAssignments as [, $date, $start, $end, $name]) {
            $scheduleRows[] = [
                'date' => $date,
                'start_time' => $start,
                'end_time' => $end,
                'name' => $name,
                'created_by' => 'system',
            ];
        }

        DB::table('schedule')->insert($scheduleRows);
        // schedule_id: 1–18

        // Recuperamos los IDs insertados en orden
        $scheduleIds = DB::table('schedule')->orderBy('schedule_id')->pluck('schedule_id')->toArray();

        foreach ($scheduleAssignments as $i => [, , , , , $personId]) {
            $workerScheduleRows[] = [
                'schedule_id' => $scheduleIds[$i],
                'person_id' => $personId,
                'is_available' => true,
                'created_by' => 'system',
            ];
        }

        DB::table('worker_schedule')->insert($workerScheduleRows);
        // worker_schedule_id: 1–18
    }

    // =========================================================================
    // PAYMENT_DATA + PAGOS + CITAS + RECIBOS + REPORTES
    // =========================================================================
    private function seedPaymentsAndAppointments(): void
    {
        // Todos los pagos y citas son del paciente María (person_id=3), agendados por Admin (person_id=1)
        //
        // Columnas: [worker_schedule_id, service_id, price, pay_status, appt_status, creation_date]
        // pay_status:  1=Pending, 2=Paid,       3=Failed
        // appt_status: 1=Scheduled, 2=Completed, 3=Cancelled
        $entries = [
            // ── Año pasado 2025 — todas completadas y pagadas ─────────────────
            [1,  1,   50.00, 2, 2, '2025-02-14 08:00:00'], // ws=1  Juan   -> Consulta General    Paid/Completed
            [2,  3,   90.00, 2, 2, '2025-04-10 09:00:00'], // ws=2  Carlos -> Neurológica          Paid/Completed
            [3,  4,   60.00, 2, 2, '2025-06-20 10:00:00'], // ws=3  Sofia  -> Pediátrica           Paid/Completed
            [4,  5,   45.00, 2, 2, '2025-09-05 11:00:00'], // ws=4  Juan   -> Electrocardiograma   Paid/Completed
            [5,  7,   35.00, 2, 2, '2025-11-18 14:00:00'], // ws=5  Carlos -> Lab                  Paid/Completed

            // ── Febrero 2026 (mes pasado) — mix de estados ────────────────────
            [6,  1,   50.00, 2, 2, '2026-02-02 08:00:00'], // ws=6  Juan   -> Consulta General      Paid/Completed
            [7,  3,   90.00, 2, 2, '2026-02-03 09:00:00'], // ws=7  Carlos -> Neurológica            Paid/Completed
            [8,  4,   60.00, 2, 2, '2026-02-04 10:00:00'], // ws=8  Sofia  -> Pediátrica             Paid/Completed
            [9,  6,  250.00, 2, 2, '2026-02-05 11:00:00'], // ws=9  Juan   -> Resonancia             Paid/Completed
            [10, 7,   35.00, 2, 2, '2026-02-06 14:00:00'], // ws=10 Carlos -> Lab                    Paid/Completed
            [11, 8,   40.00, 2, 2, '2026-02-10 08:00:00'], // ws=11 Sofia  -> Terapia Física         Paid/Completed
            [12, 2,   80.00, 2, 2, '2026-02-11 09:00:00'], // ws=12 Juan   -> Consulta Especializada Paid/Completed
            [13, 3,   90.00, 2, 2, '2026-02-12 10:00:00'], // ws=13 Carlos -> Neurológica            Paid/Completed
            [14, 4,   60.00, 3, 3, '2026-02-13 11:00:00'], // ws=14 Sofia  -> Pediátrica             Failed/Cancelled
            [15, 5,   45.00, 2, 2, '2026-02-17 08:00:00'], // ws=15 Juan   -> Electrocardiograma     Paid/Completed
            [16, 7,   35.00, 1, 1, '2026-02-18 09:00:00'], // ws=16 Carlos -> Lab                    Pending/Scheduled
            [17, 8,   40.00, 1, 1, '2026-02-24 14:00:00'], // ws=17 Sofia  -> Terapia Física         Pending/Scheduled
            [18, 6,  250.00, 1, 1, '2026-02-25 10:00:00'], // ws=18 Juan   -> Resonancia             Pending/Scheduled
        ];

        foreach ($entries as $i => [$wsId, $serviceId, $price, $payStatus, $apptStatus, $createdAt]) {
            // Payment data — PK: payment_data_id
            $paymentDataId = DB::table('payment_data')->insertGetId([
                'type' => $i % 2 === 0 ? 'Transferencia' : 'Tarjeta Débito',
                'number' => 100000000 + ($i + 1),
                'file' => 'comprobantes/pago_'.str_pad($i + 1, 3, '0', STR_PAD_LEFT).'.pdf',
                'created_by' => 'system',
            ], 'payment_data_id');

            // Pago — PK: payment_id
            $paymentId = DB::table('payment')->insertGetId([
                'person_id' => 3,
                'service_id' => $serviceId,
                'payment_data_id' => $paymentDataId,
                'service_price' => $price,
                'total_amount' => $price,
                'status' => $payStatus,
                'created_by' => 'system',
                'creation_date' => $createdAt,
            ], 'payment_id');

            // Recibo — solo si el pago fue exitoso (Paid)
            if ($payStatus === 2) {
                DB::table('receipt')->insert([
                    'payment_id' => $paymentId,
                    'status' => 'Emitido',
                    'created_by' => 'system',
                    'creation_date' => $createdAt,
                ]);
            }

            // Cita — PK: appointment_id
            $appointmentId = DB::table('appointment')->insertGetId([
                'payment_id' => $paymentId,
                'scheduled_by' => 1,
                'worker_schedule_id' => $wsId,
                'tracking_appointment' => null,
                'status' => $apptStatus,
                'created_by' => 'system',
                'creation_date' => $createdAt,
            ], 'appointment_id');

            // Reporte — solo si la cita fue completada
            if ($apptStatus === 2) {
                DB::table('appointment_report')->insert([
                    'appointment_id' => $appointmentId,
                    'comments' => 'Consulta realizada sin novedades. Paciente en buen estado general.',
                    'sign' => 'Firma Digital - Sistema',
                    'created_by' => 'system',
                    'creation_date' => $createdAt,
                ]);
            }

            // Marcamos el worker_schedule como ocupado
            DB::table('worker_schedule')
                ->where('worker_schedule_id', $wsId)
                ->update(['is_available' => false]);
        }
    }
}
