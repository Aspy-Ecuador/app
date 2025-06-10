<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Roles
        DB::table('role')->insert([
            ['name' => 'Admin'],
            ['name' => 'Professional'],
            ['name' => 'Client'],
            ['name' => 'Staff'],
        ]);

        // Estados para user_account_status
        DB::table('user_account_status')->insert([
            ['name' => 'Active'],
            ['name' => 'Inactive'],
        ]);

        // Estados para appointment_status
        DB::table('appointment_status')->insert([
            ['name' => 'Scheduled'],
            ['name' => 'Completed'],
            ['name' => 'Cancelled'],
        ]);

        // Estados para payment_status
        DB::table('payment_status')->insert([
            ['name' => 'Pending'],
            ['name' => 'Paid'],
            ['name' => 'Failed'],
        ]);

        // Géneros
        DB::table('gender')->insert([
            ['name' => 'Masculino'],
            ['name' => 'Femenino'],
        ]);

        // Ocupaciones
        DB::table('occupation')->insert([
            ['name' => 'Doctor'],
            ['name' => 'Enfermero'],
            ['name' => 'Ingeniero'],
            ['name' => 'Estudiante'],
        ]);

        // Estado civil
        DB::table('marital_status')->insert([
            ['name' => 'Soltero'],
            ['name' => 'Casado'],
            ['name' => 'Divorciado'],
        ]);

        // Educación
        DB::table('education')->insert([
            ['name' => 'Secundaria'],
            ['name' => 'Pregrado'],
            ['name' => 'Postgrado'],
        ]);

        // País, Provincia, Ciudad (ejemplo mínimo)
        DB::table('country')->insert([
            ['name' => 'Ecuador', 'phone_code' => '+593'],
        ]);
        DB::table('state')->insert([
            ['name' => 'Pichincha', 'country_id' => 1],
        ]);
        DB::table('city')->insert([
            ['name' => 'Quito', 'state_id' => 1],
        ]);

        // AGA
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

        // Usuarios de ejemplo
        DB::table('user_account')->insert([
            ['role_id' => 1, 'email' => 'admin@aspy.com', 'password_hash' => bcrypt('admin'), 'status' => 1, 'created_by' => 'system'],
            ['role_id' => 2, 'email' => 'proff@aspy.com', 'password_hash' => bcrypt('proff'), 'status' => 1, 'created_by' => 'system'],
            ['role_id' => 3, 'email' => 'client@aspy.com', 'password_hash' => bcrypt('client'), 'status' => 1, 'created_by' => 'system'],
            ['role_id' => 4, 'email' => 'staff@aspy.com', 'password_hash' => bcrypt('staff'), 'status' => 1, 'created_by' => 'system'],
        ]);

        // Personas
        DB::table('person')->insert([
            ['user_id' => 1, 'first_name' => 'Administrador', 'middle_name' => null, 'birthdate' => '1980-01-01', 'gender' => 1, 'occupation' => 3, 'marital_status' => 2, 'education' => 3, 'created_by' => 'system'],
            ['user_id' => 2, 'first_name' => 'Juan', 'middle_name' => 'Carlos', 'birthdate' => '1975-05-10', 'gender' => 1, 'occupation' => 1, 'marital_status' => 2, 'education' => 3, 'created_by' => 'system'],
            ['user_id' => 3, 'first_name' => 'María', 'middle_name' => null, 'birthdate' => '1990-12-20', 'gender' => 2, 'occupation' => 4, 'marital_status' => 1, 'education' => 2, 'created_by' => 'system'],
            ['user_id' => 4, 'first_name' => 'Luisa', 'middle_name' => null, 'birthdate' => '1985-07-15', 'gender' => 2, 'occupation' => 2, 'marital_status' => 1, 'education' => 2, 'created_by' => 'system'],
        ]);

        // Clientes, Staff y Profesionales
        DB::table('staff')->insert([['person_id' => 1, 'created_by' => 'system'], ['person_id' => 4, 'created_by' => 'system']]);
        DB::table('professional')->insert([['person_id' => 2, 'specialty' => 'Cardiologia', 'title' => 'Medico', 'created_by' => 'system']]);
        DB::table('client')->insert([['person_id' => 3, 'created_by' => 'system']]);

        // Identificaciones
        DB::table('identification')->insert([['person_id' => 3, 'type' => 'Cedula', 'number' => '1712345678', 'created_by' => 'system']]);

        // Direcciones
        DB::table('address')->insert([
            ['person_id' => 3, 'type' => 'Domicilio', 'country' => 1, 'province' => 1, 'city' => 1, 'primary_address' => 'Av. Siempre Viva 742', 'aga' => 1, 'created_by' => 'system']
        ]);

        // Teléfonos
        DB::table('phone')->insert([
            ['person_id' => 3, 'type' => 'Personal', 'number' => '0998765432', 'relationship' => 'Cliente', 'created_by' => 'system'],
            ['person_id' => 4, 'type' => 'Trabajo', 'number' => '0991234567', 'relationship' => 'Staff', 'created_by' => 'system'],
        ]);

        // Servicios y descuentos
        DB::table('discount')->insert([['name' => 'Descuento Promo', 'discount' => 10, 'created_by' => 'system']]);
        DB::table('service')->insert([['name' => 'Consulta General', 'price' => 50.00, 'created_by' => 'system']]);

        // Vincular profesional con servicio
        DB::table('professional_service')->insert([['service_id' => 1, 'person_id' => 2, 'created_by' => 'system']]);

        // Agenda y horarios
        DB::table('schedule')->insert([['date' => '2025-05-10', 'start_time' => '08:00:00', 'end_time' => '09:00:00', 'name' => 'Turno mañana', 'created_by' => 'system']]);
        DB::table('worker_schedule')->insert([
            ['schedule_id' => 1, 'person_id' => 2, 'is_available' => true, 'created_by' => 'system'], 
            ['schedule_id' => 1, 'person_id' => 4, 'is_available' => true, 'created_by' => 'system']
        ]);

        // Método de pago
        DB::table('payment_data')->insert([['type' => 'Tarjeta Crédito', 'number' => 123456789, 'file' => 'file_path', 'created_by' => 'system']]);

        // Pago
        DB::table('payment')->insert([
            ['person_id' => 3, 'service_id' => 1, 'discount_id' => 1, 'payment_data_id' => 1, 'service_price' => 50.00, 'discount_percentage' => 10, 'total_amount' => 45.00, 'status' => 2, 'created_by' => 'system']
        ]);

        // Recibo
        DB::table('receipt')->insert([['payment_id' => 1, 'status' => 'Emitido', 'created_by' => 'system']]);

        // Cita
        DB::table('appointment')->insert([
            ['payment_id' => 1, 'scheduled_by' => 1, 'worker_schedule_id' => 1, 'status' => 1, 'created_by' => 'system']
        ]);

        // Reporte de cita
        DB::table('appointment_report')->insert([['appointment_id' => 1, 'comments' => 'Todo en orden', 'sign' => 'Firma Digital', 'created_by' => 'system']]);
    }
}
