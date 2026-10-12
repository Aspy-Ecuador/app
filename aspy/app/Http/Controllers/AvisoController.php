<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Aviso;
use App\Models\BankAccount;
use App\Models\WorkerSchedule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Avisos de la cuenta que tiene la sesión. No recibe ningún id de cuenta: cada quien lee y marca solo
 * los suyos.
 *
 * Además de los avisos guardados (Aviso), responde lo que esa cuenta tiene "por revisar", contado en el
 * momento: pagos y horarios para Secretaría y el Admin, citas sin marcar para el profesional…
 */
class AvisoController extends Controller
{
    /** Los que se muestran; la cuenta conserva hasta Aviso::MAX_POR_CUENTA. */
    private const ULTIMOS = 40;

    private const CITA_GUARDADA = 1;

    private const CITA_AGENDADA = 2;

    private const CITA_ASISTIO = 3;

    public function index()
    {
        $cuenta = (int) auth()->id();

        try {
            $avisos = Aviso::where('user_account_id', $cuenta)->orderByDesc('aviso_id')->limit(self::ULTIMOS)->get();
            $sinLeer = Aviso::where('user_account_id', $cuenta)->whereNull('leido_el')->count();
        } catch (\Throwable $e) {
            report($e);
            $avisos = collect();
            $sinLeer = 0;
        }

        return response()->json([
            'avisos' => $avisos->map(fn (Aviso $a) => [
                'aviso_id' => (int) $a->aviso_id,
                'tipo' => $a->tipo,
                'titulo' => $a->titulo,
                'texto' => $a->texto,
                'enlace' => $a->enlace,
                'leido' => $a->leido_el !== null,
                'creado_el' => $a->creado_el?->toJSON(),
            ])->values(),
            'sin_leer' => $sinLeer,
            'pendientes' => $this->pendientes(),
        ]);
    }

    /** Marca como leídos los avisos propios: los de `ids`, o todos si no llega la lista. */
    public function leidos(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'sometimes|array|max:100',
            'ids.*' => 'integer|min:1',
        ]);

        $cuenta = (int) auth()->id();
        $consulta = Aviso::where('user_account_id', $cuenta)->whereNull('leido_el');
        if (array_key_exists('ids', $validated)) {
            $consulta->whereIn('aviso_id', $validated['ids']);
        }
        $marcados = $consulta->update(['leido_el' => now()]);

        return response()->json([
            'marcados' => $marcados,
            'sin_leer' => Aviso::where('user_account_id', $cuenta)->whereNull('leido_el')->count(),
        ]);
    }

    /**
     * Lo que la cuenta tiene por revisar ahora mismo, según su rol. Solo sale lo que tiene algo.
     * `accion` distingue lo que le toca resolver a esa cuenta de lo que solo le conviene saber.
     */
    private function pendientes(): array
    {
        try {
            if ($this->isStaffOrAdmin()) {
                $lista = $this->pendientesDeLaFundacion();
            } elseif ($this->isProfessional()) {
                $lista = $this->pendientesDelProfesional((int) $this->currentPersonId());
            } else {
                $lista = $this->pendientesDelPaciente((int) $this->currentPersonId());
            }
        } catch (\Throwable $e) {
            report($e);

            return [];
        }

        return array_values(array_filter($lista, fn (array $p) => $p['cantidad'] > 0));
    }

    private function pendientesDeLaFundacion(): array
    {
        $pagos = Appointment::where('appointment_status_id', self::CITA_GUARDADA)->count();
        $horarios = $this->horariosPorAprobar()->count();
        $sinEnlace = $this->virtualesSinEnlace([self::CITA_AGENDADA])->count();
        $sinMarcar = $this->sinMarcar()->count();

        $lista = [
            $this->pendiente('pagos_por_revisar', $pagos, 'Pagos por revisar',
                '1 cita espera que revises su comprobante.', "{$pagos} citas esperan que revises su comprobante.", '/pagos'),
            $this->pendiente('horarios_por_aprobar', $horarios, 'Horarios por aprobar',
                '1 horario no se ofrece a las familias hasta que lo apruebes.', "{$horarios} horarios no se ofrecen a las familias hasta que los apruebes.", '/horarios'),
            $this->pendiente('citas_virtuales_sin_enlace', $sinEnlace, 'Citas virtuales sin enlace',
                '1 cita virtual agendada todavía no tiene el enlace de la reunión.', "{$sinEnlace} citas virtuales agendadas todavía no tienen el enlace de la reunión.", '/citas'),
            $this->pendiente('citas_sin_marcar', $sinMarcar, 'Citas sin asistencia marcada',
                '1 cita ya pasó y su profesional no marcó si la persona asistió.', "{$sinMarcar} citas ya pasaron y su profesional no marcó si la persona asistió.", '/citas', false),
        ];

        if ($this->isAdmin() && ! BankAccount::query()->exists()) {
            $lista[] = $this->pendiente('datos_bancarios', 1, 'Faltan los datos bancarios',
                'Sin la cuenta de la fundación, las familias no pueden pagar sus citas.', '', '/datos-bancarios');
        }

        return $lista;
    }

    private function pendientesDelProfesional(int $personId): array
    {
        $propias = fn (Builder $q) => $q->where('professional_id', $personId);

        $sinMarcar = $propias($this->sinMarcar())->count();
        $sinReporte = Appointment::where('professional_id', $personId)->where('appointment_status_id', self::CITA_ASISTIO)->doesntHave('report')->count();
        $sinEnlace = $propias($this->virtualesSinEnlace([self::CITA_GUARDADA, self::CITA_AGENDADA]))->count();
        $horarios = $this->horariosPorAprobar()->where('professional_id', $personId)->count();

        return [
            $this->pendiente('citas_sin_marcar', $sinMarcar, 'Citas sin asistencia marcada',
                '1 cita ya pasó: marca si la persona asistió.', "{$sinMarcar} citas ya pasaron: marca si cada persona asistió.", '/dashboard'),
            $this->pendiente('citas_sin_reporte', $sinReporte, 'Sesiones sin reporte',
                '1 sesión atendida todavía no tiene su reporte.', "{$sinReporte} sesiones atendidas todavía no tienen su reporte.", '/dashboard'),
            $this->pendiente('citas_virtuales_sin_enlace', $sinEnlace, 'Citas virtuales sin enlace',
                '1 cita virtual todavía no tiene el enlace de la reunión.', "{$sinEnlace} citas virtuales todavía no tienen el enlace de la reunión.", '/citas'),
            $this->pendiente('horarios_por_aprobar', $horarios, 'Horarios tuyos por aprobar',
                '1 horario espera la aprobación de Secretaría: todavía no se ofrece.', "{$horarios} horarios esperan la aprobación de Secretaría: todavía no se ofrecen.", '/seleccionar-horario', false),
        ];
    }

    private function pendientesDelPaciente(int $personId): array
    {
        $porRevisar = Appointment::where('client_id', $personId)->where('appointment_status_id', self::CITA_GUARDADA)->count();

        return [
            $this->pendiente('citas_por_confirmar', $porRevisar, 'Citas por confirmar',
                '1 cita espera que Secretaría revise tu comprobante. Te avisaremos aquí.', "{$porRevisar} citas esperan que Secretaría revise tus comprobantes. Te avisaremos aquí.", '/dashboard', false),
        ];
    }

    private function pendiente(string $clave, int $cantidad, string $titulo, string $uno, string $varios, string $enlace, bool $accion = true): array
    {
        return [
            'clave' => $clave,
            'cantidad' => $cantidad,
            'titulo' => $titulo,
            'texto' => $cantidad === 1 ? $uno : $varios,
            'enlace' => $enlace,
            'accion' => $accion,
        ];
    }

    /** Los mismos que lista la pantalla Horarios: sin aprobar y de hoy en adelante. */
    private function horariosPorAprobar(): Builder
    {
        $hoy = now()->toDateString();

        return WorkerSchedule::where('aprobado', false)
            ->whereHas('schedule', fn (Builder $q) => $q->whereDate('date', '>=', $hoy));
    }

    /** Citas virtuales de hoy en adelante cuyo horario todavía no tiene el enlace de la reunión. */
    private function virtualesSinEnlace(array $estados): Builder
    {
        $hoy = now()->toDateString();

        return Appointment::whereIn('appointment_status_id', $estados)
            ->whereHas('workerSchedule', function (Builder $q) use ($hoy) {
                $q->where('modalidad', WorkerSchedule::VIRTUAL)
                    ->where(fn (Builder $w) => $w->whereNull('enlace_virtual')->orWhere('enlace_virtual', ''))
                    ->whereHas('schedule', fn (Builder $s) => $s->whereDate('date', '>=', $hoy));
            });
    }

    /** Citas Agendadas que ya empezaron y siguen sin asistencia marcada. */
    private function sinMarcar(): Builder
    {
        $hoy = now()->toDateString();
        $hora = now()->format('H:i:s');

        return Appointment::where('appointment_status_id', self::CITA_AGENDADA)
            ->whereHas('workerSchedule.schedule', function (Builder $q) use ($hoy, $hora) {
                // Agrupado: un "o" suelto se saldría de la relación y contaría citas de cualquier horario
                $q->where(function (Builder $g) use ($hoy, $hora) {
                    $g->whereDate('date', '<', $hoy)
                        ->orWhere(fn (Builder $w) => $w->whereDate('date', $hoy)->where('start_time', '<=', $hora));
                });
            });
    }
}
