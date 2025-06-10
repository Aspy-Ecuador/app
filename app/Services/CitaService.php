<?php
namespace App\Services;

use App\Models\Cita;
use App\Http\Requests\createCitaRequestBody;

/**
 * Class CitaService
 * @package App\Services
 * @version 1.0
 * @author Melissa Ayllon
 * @description Service class for handling Cita operations.
 * @property Cita $cita
 */
class CitaService
{

    public function getCitaById($idCita): ?Cita
    {
        return Cita::find($idCita);
    }

    public function getCitasByPaciente($cedulaPaciente): ?array
    {
        return Cita::where('cedulaPaciente', $cedulaPaciente)->get()->toArray();
    }

    public function getCitasEntreFechas($fechaInicio, $fechaFin): ?array
    {
        return Cita::whereBetween('fecha', [$fechaInicio, $fechaFin])->get()->toArray();
    }

    public function getCitasByProfesional($profesional): ?array
    {
        return Cita::where('profesional', $profesional)->get()->toArray();
    }

    // TODO PRIMERO SE DEBE VALIDAR QUE EL ESTADO EXISTA EN LA BASE DE DATOS
    public function getCitasByEstado($estado): ?array
    {
        //Buscar en la tabla estado el id del estado
        //Si no existe el estado, retornar null
        //Si existe el estado, buscar en la tabla cita el id del estado
        //y retornar las citas que tengan ese estado
        //Ejemplo: $estadoId = Estado::where('estado', $estado)->first();
        //return $estadoId->idEstado;
        //return Cita::where('estado', $estadoId)->get()->toArray();
        return Cita::where('estado', $estado)->get()->toArray();
    }

    public function getHistoriaClinicaByPaciente($cedulaPaciente): ?array
    {
        return Cita::where('cedulaPaciente', $cedulaPaciente)->get()->toArray();
    }

    public function getHistoriaClinicaByCita($idCita): ?array
    {
        return Cita::where('idCita', $idCita)->get()->toArray();
    }

    public function createCita(array $request): Cita
    {
        return Cita::create([
            'cedulaPaciente' => $request['cedulaPaciente'],
            'profesional' => $request['profesional'],
            'servicio' => $request['servicio'],
            'tipoConsulta' => $request['tipoConsulta'],
            'fecha' => $request['fecha'],
            'horaInicio' => $request['horaInicio'],
            'horaFin' => $request['horaFin']
        ]);
    }
}