<?php

namespace App\Services;

class ServiciosService
{
    public function getAllServicios(): ?array
    {
        // Simulación de datos de servicios
        return [
            ['id' => 1, 'nombre' => 'Servicio 1'],
            ['id' => 2, 'nombre' => 'Servicio 2'],
            ['id' => 3, 'nombre' => 'Servicio 3']
        ];
    }

    public function getServicioById($id): ?array
    {
        // Simulación de datos de un servicio por ID
        return ['id' => $id, 'nombre' => 'Servicio 1'];
    }

    public function createServicio(array $request): array
    {
        // Simulación de creación de un servicio
        return [
            'message' => 'Servicio creado exitosamente',
            'data' => $request
        ];
    }

    public function updateServicio(array $request, $id): array
    {
        // Simulación de actualización de un servicio
        return [
            'message' => 'Servicio actualizado exitosamente',
            'data' => $request
        ];
    }
}