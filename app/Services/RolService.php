<?php

namespace App\Services;

class RolService
{
    public function getAllRoles(): ?array
    {
        // Simulación de datos de roles
        return [
            ['id' => 1, 'nombre' => 'Administrador'],
            ['id' => 2, 'nombre' => 'Usuario'],
            ['id' => 3, 'nombre' => 'Invitado']
        ];
    }

    public function getRolById($id): ?array
    {
        // Simulación de datos de un rol por ID
        return ['id' => $id, 'nombre' => 'Administrador'];
    }

    public function createRol(array $request): array
    {
        // Simulación de creación de un rol
        return [
            'message' => 'Rol creado exitosamente',
            'data' => $request
        ];
    }

    public function updateRol(array $request, $id): array
    {
        // Simulación de actualización de un rol
        return [
            'message' => 'Rol actualizado exitosamente',
            'data' => $request,
            'id' => $id
        ];
    }
}