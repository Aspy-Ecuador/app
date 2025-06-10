<?php

namespace App\Services;

class UsuarioService
{
    public function getAllUsuarios(){
        // mock data de usuarios
        return [
            [
                'id' => 1,
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'email' => ''
            ]
        ];
    }

    public function getUsuarioById($id){
        // mock data de usuario
        return [
            'id' => $id,
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => ''
        ];
    }

    public function getUsuariosByRol($role){
        // mock data de usuario
        return [
            'id' => 1,
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => ''
        ];
    }

    public function createUsuario(array $request){
        // mock data de usuario creado
        return [
            'message' => 'Rol creado exitosamente',
            'data' => $request
        ];
    }

    public function updateUsuario($id, $data){
        // mock data de usuario actualizado
        return [
            'message' => 'Rol actualizado exitosamente',
            'data' => $data,
            'id' => $id
        ];
    }
}