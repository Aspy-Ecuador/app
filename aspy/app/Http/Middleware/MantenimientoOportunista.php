<?php

namespace App\Http\Middleware;

use App\Models\ArchivoPrivado;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

/**
 * Limpieza de lo que ya venció, para que la base de datos no crezca sin control.
 *
 * El servidor no tiene tareas programadas (solo Nginx y PHP), así que la limpieza se hace de vez en
 * cuando, después de responder una petición cualquiera (más o menos 1 de cada 100; no la demora):
 * - contadores vencidos de los límites de intentos (tabla `cache`);
 * - sesiones vencidas (tokens de Sanctum);
 * - comprobantes y reportes subidos hace más de un día que nunca se usaron.
 */
class MantenimientoOportunista
{
    private const UNA_DE_CADA = 100;

    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        if (random_int(1, self::UNA_DE_CADA) !== 1) {
            return;
        }

        self::limpiar();
    }

    public static function limpiar(): void
    {
        $tareas = [
            function () {
                if (config('cache.default') === 'database') {
                    DB::table(config('cache.stores.database.table', 'cache'))->where('expiration', '<', time())->delete();
                }
            },
            function () {
                $minutos = config('sanctum.expiration');
                if ($minutos) {
                    PersonalAccessToken::where('created_at', '<', now()->subMinutes((int) $minutos))->delete();
                }
            },
            fn () => ArchivoPrivado::borrarSinUsarVencidos(),
        ];

        foreach ($tareas as $tarea) {
            try {
                $tarea();
            } catch (\Throwable $e) {
                report($e); // una limpieza que falla no debe afectar a nadie
            }
        }
    }
}
