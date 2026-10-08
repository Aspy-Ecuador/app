<?php

namespace App\Http\Controllers;

use App\Models\Ajuste;
use App\Models\ArchivoPrivado;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Ajustes del sistema.
 * - Los leen Secretaría y el Admin (Secretaría los necesita para saber qué pasa al rechazar un pago).
 * - Solo el Admin los cambia (la ruta usa role:admin).
 */
class AjusteController extends Controller
{
    private const PAGO_RECHAZADO = 3;

    public function show()
    {
        return response()->json($this->ajustes());
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            Ajuste::COMPROBANTE_RECHAZADO_DIAS => ['required', 'integer', Rule::in(Ajuste::DIAS_PERMITIDOS)],
        ], [
            Ajuste::COMPROBANTE_RECHAZADO_DIAS.'.in' => 'Elige una de las opciones de la lista.',
        ]);
        $dias = (int) $validated[Ajuste::COMPROBANTE_RECHAZADO_DIAS];

        try {
            DB::transaction(function () use ($dias) {
                Ajuste::updateOrCreate(
                    ['clave' => Ajuste::COMPROBANTE_RECHAZADO_DIAS],
                    ['valor' => (string) $dias, 'modified_by' => auth()->id(), 'modification_date' => now()]
                );

                // El cambio vale también para los comprobantes rechazados que todavía se conservan:
                // su fecha de borrado se recalcula desde el día del rechazo (o se quita, si ya no se borran)
                $rechazados = Payment::where('payment_status_id', self::PAGO_RECHAZADO)
                    ->whereNotNull('payment_data_id')
                    ->get(['payment_data_id', 'modification_date', 'creation_date']);
                foreach ($rechazados as $pago) {
                    $rechazadoEl = $pago->modification_date ?? $pago->creation_date ?? now();
                    ArchivoPrivado::where('payment_data_id', $pago->payment_data_id)
                        ->update(['eliminar_el' => $dias > 0 ? Carbon::parse($rechazadoEl)->addDays($dias) : null]);
                }
            });
        } catch (\Throwable $e) {
            return $this->serverError('No se pudo guardar el ajuste.', $e);
        }

        return response()->json(['message' => 'Ajuste guardado.'] + $this->ajustes());
    }

    private function ajustes(): array
    {
        return [
            Ajuste::COMPROBANTE_RECHAZADO_DIAS => Ajuste::comprobanteRechazadoDias(),
            'opciones_dias' => Ajuste::DIAS_PERMITIDOS,
        ];
    }
}
