<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateRolRequestBody;
use App\Http\Requests\UpdateRolRequestBody;
use App\Services\RolService;
use Illuminate\Http\Request;

class RolController extends Controller
{
    
    protected RolService $rolService;

    public function __construct(RolService $rolService){
        $this->rolService = $rolService;
    }

    function getAllRoles(){
        return $this->rolService->getAllRoles();
    }

    function getRolById($id){
        return $this->rolService->getRolById($id);
    }

    function createRol(CreateRolRequestBody $request){
        // Validar el request usando el Form Request
        $validated = $request->validated();

        return $this->rolService->createRol($validated);
    }

    function updateRol(UpdateRolRequestBody $request, $id){
        // Validar el request usando el Form Request
        $validated = $request->validated();
        return $this->rolService->updateRol($validated, $id);
    }
}
