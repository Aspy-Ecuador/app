<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateReporteRequestBody;
use App\Services\ReporteService;
use Illuminate\Http\Request;

class ReporteController extends Controller
{

    protected ReporteService $reporteService;

    public function __construct(ReporteService $reporteService)
    {
        $this->reporteService = $reporteService;
    }

    function getReporteById($id){
        $reporte = $this->reporteService->getReporteById($id);
        if ($reporte) {
            return response()->json($reporte, 200);
        } else {
            return response()->json(['message' => 'Reporte no encontrado'], 404);
        }
    }

    function createReporte(CreateReporteRequestBody $request){
       $validated = $request->validated();
        $reporte = $this->reporteService->createReporte($validated);
        if ($reporte) {
            return response()->json($reporte, 201);
        } else {
            return response()->json(['message' => 'Error al crear el reporte'], 500);
        }
    }

    function getReportesByPaciente($id){
        $reportes = $this->reporteService->getReportesByPaciente($id);
        if ($reportes) {
            return response()->json($reportes, 200);
        } else {
            return response()->json(['message' => 'No se encontraron reportes para este paciente'], 404);
        }
    }

    function getReportesEntreFechas($fechaInicio, $fechaFin){
        $reportes = $this->reporteService->getReportesEntreFechas($fechaInicio, $fechaFin);
        if ($reportes) {
            return response()->json($reportes, 200);
        } else {
            return response()->json(['message' => 'No se encontraron reportes entre estas fechas'], 404);
        }
    }

    function getReportesByProfesional($profesionalId){
        $reportes = $this->reporteService->getReportesByProfesional($profesionalId);
        if ($reportes) {
            return response()->json($reportes, 200);
        } else {
            return response()->json(['message' => 'No se encontraron reportes para este profesional'], 404);
        }
    }
    
}
