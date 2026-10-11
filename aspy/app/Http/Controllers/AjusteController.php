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
 * - Cada ajuste se puede guardar por separado: solo cambia lo que llega en la petición.
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
            Ajuste::COMPROBANTE_RECHAZADO_DIAS => ['sometimes', 'required', 'integer', Rule::in(Ajuste::DIAS_PERMITIDOS)],
            Ajuste::HORARIO_ALCANCE => ['sometimes', 'required', 'string', Rule::in(Ajuste::ALCANCES)],
            Ajuste::HORARIO_SECRETARIA => ['sometimes', 'required', 'boolean'],
        ], [
            Ajuste::COMPROBANTE_RECHAZADO_DIAS.'.in' => 'Elige una de las opciones de la lista.',
            Ajuste::HORARIO_ALCANCE.'.in' => 'Elige una de las opciones de la lista.',
            Ajuste::HORARIO_SECRETARIA.'.boolean' => 'Indica si Secretaría puede crear horarios o no.',
        ]);
        if ($validated === []) {
            return response()->json(['message' => 'No se indicó ningún ajuste para guardar.'], 422);
        }

        try {
            DB::transaction(function () use ($validated) {
                if (array_key_exists(Ajuste::COMPROBANTE_RECHAZADO_DIAS, $validated)) {
                    $dias = (int) $validated[Ajuste::COMPROBANTE_RECHAZADO_DIAS];
                    $this->guardar(Ajuste::COMPROBANTE_RECHAZADO_DIAS, (string) $dias);

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
                }

                // Horarios: el cambio vale para los que se creen desde ahora (los ya creados no se tocan)
                if (array_key_exists(Ajuste::HORARIO_ALCANCE, $validated)) {
                    $this->guardar(Ajuste::HORARIO_ALCANCE, $validated[Ajuste::HORARIO_ALCANCE]);
                }
                if (array_key_exists(Ajuste::HORARIO_SECRETARIA, $validated)) {
                    $this->guardar(Ajuste::HORARIO_SECRETARIA, filter_var($validated[Ajuste::HORARIO_SECRETARIA], FILTER_VALIDATE_BOOLEAN) ? '1' : '0');
                }
            });
        } catch (\Throwable $e) {
            return $this->serverError('No se pudo guardar el ajuste.', $e);
        }

        return response()->json(['message' => 'Ajuste guardado.'] + $this->ajustes());
    }

    private function guardar(string $clave, string $valor): void
    {
        Ajuste::updateOrCreate(['clave' => $clave], ['valor' => $valor, 'modified_by' => auth()->id(), 'modification_date' => now()]);
    }

    private function ajustes(): array
    {
        return [
            Ajuste::COMPROBANTE_RECHAZADO_DIAS => Ajuste::comprobanteRechazadoDias(),
            'opciones_dias' => Ajuste::DIAS_PERMITIDOS,
            Ajuste::HORARIO_ALCANCE => Ajuste::horarioAlcance(),
            'opciones_alcance' => Ajuste::ALCANCES,
            // Hasta qué día se puede crear un horario hoy con el alcance vigente
            'horario_hasta' => Ajuste::horarioHasta()->toDateString(),
            Ajuste::HORARIO_SECRETARIA => Ajuste::horarioSecretaria(),
        ];
    }
}
