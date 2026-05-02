<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================================
        // CATÁLOGOS BASE
        // ============================================================
 
        DB::table('role')->insert([
            ['name' => 'Admin',        'creation_date' => now()],
            ['name' => 'Professional', 'creation_date' => now()],
            ['name' => 'Client',       'creation_date' => now()],
            ['name' => 'Staff',        'creation_date' => now()],
        ]);
 
        DB::table('user_account_status')->insert([
            ['name' => 'Activo'],
            ['name' => 'Inactivo'],
        ]);
 
        DB::table('gender')->insert([
            ['name' => 'Masculino'],
            ['name' => 'Femenino'],
            ['name' => 'Prefiero no decir'],
        ]);
 
        DB::table('occupation')->insert([
            ['name' => 'Psicólogo/a'],
            ['name' => 'Psiquiatra'],
            ['name' => 'Terapeuta'],
            ['name' => 'Estudiante'],
            ['name' => 'Docente'],
            ['name' => 'Ingeniero/a'],
            ['name' => 'Médico/a'],
            ['name' => 'Abogado/a'],
            ['name' => 'Empresario/a'],
        ]);
 
        DB::table('marital_status')->insert([
            ['name' => 'Soltero/a'],
            ['name' => 'Casado/a'],
            ['name' => 'Divorciado/a'],
            ['name' => 'Viudo/a'],
            ['name' => 'Unión libre'],
        ]);
 
        DB::table('education')->insert([
            ['name' => 'Primaria'],
            ['name' => 'Secundaria'],
            ['name' => 'Bachillerato'],
            ['name' => 'Técnico/Tecnológico'],
            ['name' => 'Universitario'],
            ['name' => 'Posgrado'],
            ['name' => 'Doctorado'],
        ]);
 
        DB::table('payment_status')->insert([
            ['name' => 'Aprobado'],
            ['name' => 'Pendiente'],
            ['name' => 'Rechazado'],
        ]);
 
        DB::table('receipt_status')->insert([
            ['name' => 'Generado'],
            ['name' => 'Pendiente'],
        ]);
 
        DB::table('appointment_status')->insert([
            ['name' => 'Guardada'],
            ['name' => 'Agendada'],
            ['name' => 'Completada'],
            ['name' => 'Perdida'],
        ]);
 
        // ============================================================
        // GEOGRAFÍA — ECUADOR
        // ============================================================
 
        DB::table('country')->insert([
            'name' => 'Ecuador', 'phone_code' => '+593',
        ]);
 
        $provinces = [
            'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo',
            'Cotopaxi', 'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas',
            'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago',
            'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena',
            'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe',
        ];
 
        foreach ($provinces as $province) {
            DB::table('state')->insert(['country_id' => 1, 'name' => $province]);
        }
 
        $cities = [
            1  => ['Cuenca', 'Gualaceo', 'Paute', 'Sígsig', 'Girón'],
            2  => ['Guaranda', 'Chillanes', 'Chimbo', 'Echeandía', 'San Miguel'],
            3  => ['Azogues', 'Cañar', 'Biblián', 'La Troncal', 'El Tambo'],
            4  => ['Tulcán', 'Montúfar', 'Espejo', 'Mira', 'Bolívar'],
            5  => ['Riobamba', 'Alausí', 'Chambo', 'Guano', 'Chunchi'],
            6  => ['Latacunga', 'La Maná', 'Salcedo', 'Saquisilí', 'Pangua'],
            7  => ['Machala', 'Pasaje', 'Santa Rosa', 'Huaquillas', 'Arenillas'],
            8  => ['Esmeraldas', 'Atacames', 'Quinindé', 'Muisne', 'San Lorenzo'],
            9  => ['Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil', 'Santa Cruz', 'Isabela'],
            10 => ['Guayaquil', 'Samborondón', 'Daule', 'Milagro', 'Durán'],
            11 => ['Ibarra', 'Otavalo', 'Cotacachi', 'Antonio Ante', 'Urcuquí'],
            12 => ['Loja', 'Catamayo', 'Macará', 'Cariamanga', 'Zamora'],
            13 => ['Babahoyo', 'Quevedo', 'Ventanas', 'Vinces', 'Baba'],
            14 => ['Portoviejo', 'Manta', 'Chone', 'El Carmen', 'Jipijapa'],
            15 => ['Macas', 'Gualaquiza', 'Sucúa', 'Méndez', 'Palora'],
            16 => ['Tena', 'Archidona', 'El Chaco', 'Quijos', 'Carlos Julio Arosemena Tola'],
            17 => ['Francisco de Orellana', 'La Joya de los Sachas', 'Loreto', 'Aguarico', 'Dayuma'],
            18 => ['Puyo', 'Mera', 'Santa Clara', 'Arajuno', 'Shell'],
            19 => ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Rumiñahui'],
            20 => ['Santa Elena', 'La Libertad', 'Salinas', 'Ancón', 'Chanduy'],
            21 => ['Santo Domingo', 'La Concordia', 'Valle Hermoso', 'Alluriquín', 'Puerto Limón'],
            22 => ['Nueva Loja', 'Shushufindi', 'Lago Agrio', 'Putumayo', 'Gonzalo Pizarro'],
            23 => ['Ambato', 'Baños de Agua Santa', 'Pelileo', 'Píllaro', 'Patate'],
            24 => ['Zamora', 'Yantzaza', 'Zumba', 'Centinela del Cóndor', 'El Pangui'],
        ];
 
        foreach ($cities as $stateId => $names) {
            foreach ($names as $name) {
                DB::table('city')->insert(['state_id' => $stateId, 'name' => $name]);
            }
        }
 
        // ============================================================
        // USUARIO ADMIN
        // ============================================================
        DB::table('user_account')->insert([
            'role_id'       => 1,
            'status_id'     => 1,
            'email'         => 'admin@aspy.com',
            'password_hash' => Hash::make('ADMIN'),
            'creation_date' => now(),
        ]);
        $userId = DB::table('user_account')->where('email', 'admin@aspy.com')->value('user_account_id');

        DB::table('person')->insert([
            'user_id'           => $userId,
            'gender_id'         => 1,
            'occupation_id'     => 1,
            'marital_status_id' => 1,
            'education_id'      => 6,
            'first_name'        => 'Administrador',
            'last_name'         => 'ASPY',
            'birthdate'         => '1990-01-01',
            'creation_date'     => now(),
        ]);
        $personId = DB::table('person')->where('user_id', $userId)->value('person_id');

        DB::table('staff')->insert([
            'person_id'     => $personId,
            'creation_date' => now(),
        ]);
 
        DB::table('phone')->insert([
            'person_id'     => $personId,
            'number'        => '+593987654321',
            'type'          => 'Celular',
            'creation_date' => now(),
        ]);
 
        $cityId = DB::table('city')->where('name', 'Quito')->value('city_id');
 
        DB::table('address')->insert([
            'person_id'         => $personId,
            'type'              => 'Principal',
            'country_id'        => 1,
            'state_id'          => 19, // Pichincha
            'city_id'           => $cityId,
            'primary_address'   => 'Av. Amazonas N35-17 y Japón',
            'secondary_address' => 'Edificio Torre 1000, Piso 3, Oficina 301',
            'creation_date'     => now(),
        ]);
 
        DB::table('identification')->insert([
            'person_id'     => $personId,
            'type'          => 'Cédula de Identidad',
            'number'        => '1712345678',
            'creation_date' => now(),
        ]);
    }
}