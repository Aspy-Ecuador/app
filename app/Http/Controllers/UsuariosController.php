<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUsuarioRequestBody;
use App\Http\Requests\UpdateUsuarioRequestBody;
use App\Services\UsuarioService;
use Illuminate\Http\Request;

class UsuariosController extends Controller
{
    protected UsuarioService $usuarioService;

    public function __construct(UsuarioService $usuarioService)
    {
        $this->usuarioService = $usuarioService;
    }

    function getAllUsuarios(){
        return $this->usuarioService->getAllUsuarios();
    }

    function getUsuarioById($id){
        return $this->usuarioService->getUsuarioById($id);
    }

    function getUsuariosByRol($role){
        return $this->usuarioService->getUsuariosByRol($role);
    }

    function createUsuario(CreateUsuarioRequestBody $request){
        $validated = $request->validated();
        return $this->usuarioService->createUsuario($validated);   
    }

    function updateUsuario(UpdateUsuarioRequestBody $request, $id){
        $validated = $request->validated();
        return $this->usuarioService->updateUsuario($id, $validated);
    }
}
