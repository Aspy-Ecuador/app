<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateServicioRequestBody;
use App\Http\Requests\UpdateServicioRequestBody;
use App\Services\ServiciosService;
use Illuminate\Http\Request;

class ServiciosController extends Controller
{
    protected ServiciosService $servicioService;

    public function __construct(ServiciosService $servicioService)
    {
        $this->servicioService = $servicioService;
    }
    function getAllServicios()
    {
        return $this->servicioService->getAllServicios();
    }


    function getServicioById($id)
    {
        return $this->servicioService->getServicioById($id);
    }

    function createServicio(CreateServicioRequestBody $request)
    {
        $validated = $request->validated();
        return $this->servicioService->createServicio($validated);
    }

    function updateServicio(UpdateServicioRequestBody $request, $id)
    {
        $validated = $request->validated();
        return $this->servicioService->updateServicio($id, $validated);
    }
}
