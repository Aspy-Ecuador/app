<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePagoRequestBody;
use App\Http\Requests\UpdateEstadoPago;
use App\Services\PagoService;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    protected PagoService $pagoService;

    public function __construct(PagoService $pagoService)
    {
        $this->pagoService = $pagoService;
    }

    function getPagosByPaciente($id){
        
        return response()->json($this->pagoService->getPagosByPaciente($id), 200);
    }

    function getPagoByCita($citaId){
        return response()->json($this->pagoService->getPagoByCita($citaId), 200);
    }

    function getPagosByEstado($estado){
        return response()->json($this->pagoService->getPagosByEstado($estado), 200);
    }

    function getPagosByServicio($servicioId){
        return response()->json($this->pagoService->getPagosByServicio($servicioId), 200);  
    }

    function createPago(CreatePagoRequestBody $request){
        $validation = $request->validated();
        return response()->json($this->pagoService->createPago($validation), 201);
    }

    function updateEstadoPago(UpdateEstadoPago $request, $idCita){
        $validation = $request->validated();
        return response()->json($this->pagoService->updateEstadoPago($validation, $idCita), 200);
    }
}
