<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

        //
    }

    /**
     * Límites de intentos. Protegen al sistema de quien quiera saturarlo: nadie puede hacer miles de
     * peticiones, adivinar contraseñas a la fuerza, crear cuentas en masa ni llenar la base de archivos.
     * Una persona que usa el sistema con normalidad nunca llega a estos números.
     */
    public function boot(): void
    {
        // Respuesta en español cuando se pasa un límite (el navegador recibe cuántos segundos esperar)
        $aviso = fn (string $mensaje) => fn (Request $request, array $headers) => response()->json(['message' => $mensaje], 429, $headers);
        $espera = $aviso('Demasiadas solicitudes seguidas. Espera un minuto e inténtalo de nuevo.');

        // Todo el API: por cuenta si hay sesión, por IP si no. Las escrituras tienen un límite más bajo.
        RateLimiter::for('api', function (Request $request) use ($espera) {
            $cuenta = auth('sanctum')->user()?->getAuthIdentifier();
            $quien = $cuenta ? 'cuenta:'.$cuenta : 'ip:'.$request->ip();
            $limites = [Limit::perMinute(600)->by($quien)->response($espera)];
            if (! $request->isMethodSafe()) {
                $limites[] = Limit::perMinute(120)->by('escribe|'.$quien)->response($espera);
            }

            return $limites;
        });

        // Ingreso: 10 intentos por minuto por correo + IP, y 30 por IP (para quien pruebe muchos correos)
        RateLimiter::for('login', function (Request $request) use ($aviso) {
            $respuesta = $aviso('Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.');

            return [
                Limit::perMinute(10)->by(strtolower((string) $request->input('email')).'|'.$request->ip())->response($respuesta),
                Limit::perMinute(30)->by('ingreso-ip|'.$request->ip())->response($respuesta),
            ];
        });

        // Registro público: 5 cuentas por minuto y 50 por día desde una misma IP
        RateLimiter::for('registro', function (Request $request) use ($aviso) {
            return [
                Limit::perMinute(5)->by('registro|'.$request->ip())->response($aviso('Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.')),
                Limit::perDay(50)->by('registro-dia|'.$request->ip())->response($aviso('Hoy ya se crearon muchas cuentas desde esta conexión. Inténtalo mañana o pide a la fundación que cree tu cuenta.')),
            ];
        });

        // Comprobantes y reportes: 20 subidas y 60 aperturas por minuto por cuenta
        // (el tope por día y el de archivos sin usar están en ArchivoPrivadoController)
        RateLimiter::for('archivos-subir', fn (Request $request) => Limit::perMinute(20)->by('subir|'.($request->user()?->getAuthIdentifier() ?? $request->ip()))->response($espera));
        RateLimiter::for('archivos-ver', fn (Request $request) => Limit::perMinute(60)->by('ver|'.($request->user()?->getAuthIdentifier() ?? $request->ip()))->response($espera));

        // Horarios: 60 por minuto por cuenta
        RateLimiter::for('horarios', fn (Request $request) => Limit::perMinute(60)->by('horarios|'.($request->user()?->getAuthIdentifier() ?? $request->ip()))->response($espera));
    }
}
