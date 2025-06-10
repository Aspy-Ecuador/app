<?php

namespace App\Services;

use App\Models\Pago;
use App\Models\Cita;
use App\Http\Requests\createPagoRequestBody;
use App\Http\Requests\UpdateEstadoPago;

class PagoService
{

    public function getPagosByPaciente($idPaciente): ?array
    {
        $citas = Cita::where('cedulaPaciente', $idPaciente)
                    ->with('pago')
                    ->get();
        
        $pagos = $citas->pluck('pago')->filter();

        return $pagos->toArray();
    }

    public function getPagoByCita($citaId): ?Pago
    {
        return Pago::where('citaid', $citaId)->first();
    }

    //TODO: JOIN CON cita
    public function getPagosByEstado($estado): ?array
    {
        return Pago::where('estado', $estado)->get()->toArray();
    }

    //TODO : JOIN CON cita Y servicio
    public function getPagosByServicio($servicioId): ?array
    {
        return Pago::where('servicioId', $servicioId)->get()->toArray();
    }

    public function createPago(array $request): Pago
    {
        return Pago::create([
            'citaid' => $request['citaId'],
            'metodopago' => $request['metodoPago'],
            'fechapago' => $request['fechaPago'],
            'comprobante' => $request['comprobante'],
        ]);
    }

    //TODO VER SI VA O NO ESTADO EN ESTE MODELO ( SINO CAMBIO EN MODELO)
    public function updateEstadoPago(array $request, $idCita): ?Pago
    {
        $pago = Pago::where('citaId', $idCita)->first();
        if ($pago) {
            $pago->estado = $request['estado'];
            $pago->save();
            return $pago;
        }
        return null;
    }
}