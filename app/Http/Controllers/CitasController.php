<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\createCitaRequestBody;
use App\Http\Requests\UpdateCitaRequestBody;
use App\Services\CitaService;
use Illuminate\Http\Request;

/**
 * CitasController
 *
 * @author Aspy
 * @version 1.0
 * @package App\Http\Controllers
 * 
 * Documentation:
 * ONLY for calling service and validating data.
 */

class CitasController extends Controller
{

    protected CitaService $citaService;

    public function __construct(CitaService $citaService)
    {
        $this->citaService = $citaService;
    }


    function getCitaById($id){
        $data = [
            'id' => 1,
            'nombre' => 'Cita 1',
            'fecha' => '2023-10-01',
            'hora' => '10:00 AM',
            'paciente' => 'Juan Perez',
            'doctor' => 'Dr. Smith'
        ];
        
        return response()->json($this->citaService->getCitaById($id), 200);
    }

    function getCitasByPaciente($id){
        return response()->json($this->citaService->getCitasByPaciente($id), 200);
    }

    function getCitasEntreFechas($fechaInicio, $fechaFin){
        return response()->json($this->citaService->getCitasEntreFechas($fechaInicio, $fechaFin), 200);
    }

    function getCitasByProfesional($profesionalId){
        return response()->json($this->citaService->getCitasByProfesional($profesionalId), 200);
    }

    function getCitasByEstado($estado){
        return response()->json($this->citaService->getCitasByEstado($estado), 200);
    }

    function getHistoriaClinicaByPaciente($pacienteId){
        return response()->json($this->citaService->getHistoriaClinicaByPaciente($pacienteId), 200);
    }

    function getHistoriaClinicaByCita($citaId){
        return response()->json($this->citaService->getHistoriaClinicaByCita($citaId), 200);
    }

    function createCita(createCitaRequestBody $request){
        $validatedData = $request->validated();

        $cita = $this->citaService->createCita($validatedData);
        return response()->json([
            'message' => 'Cita created successfully',
            'data' => $cita
        ], 201);
    }

    //TODO
    function updateCita(UpdateCitaRequestBody $request, $citaId){
        $validatedData = $request->validated();

        return response()->json([
            'message' => 'Cita updated successfully',
            'data' => $validatedData
        ], 200);
    }

}
