<?php

use App\Models\Service;
use App\Models\UserAccount;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\putJson;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
uses(RefreshDatabase::class); // Limpia y corre todas las migraciones en cada test

beforeEach(function () {

    $this->user = UserAccount::factory()->create();
    actingAs($this->user); // Asegura autenticación
    $this->service = Service::factory()->create([
        'name' => 'Consulta Inicial',
        'price' => 30.00,
    ]);
});
it('verifica si la tabla service existe', function () {
    $this->assertTrue(\Schema::hasTable('service'));
});

it('TC37 - actualiza el nombre del servicio si es válido', function () {
    $response = putJson("/api/service/{$this->service->service_id}", [
        'name' => 'Consulta General',
        'price' => 35.00,
    ]);

    $response->assertOk()
             ->assertJsonFragment(['name' => 'Consulta General']);

    expect(Service::find($this->service->service_id)->name)->toBe('Consulta General');
});

it('TC38 - no actualiza el servicio si no es válido', function () {
    $response = putJson("/api/service/{$this->service->service_id}", [
        'name' => '',
        'price' => -10.00,
    ]);

    $response->assertUnprocessable()
             ->assertJsonValidationErrors(['name', 'price']);

    expect(Service::find($this->service->service_id)->name)->toBe('Consulta Inicial');
});

