<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        // El sitio publicado está detrás del proxy de la plataforma (Railway). Sin esto, todas las personas
        // llegan con la IP del proxy: los límites de intentos por IP serían uno solo para todo el mundo
        // (una persona abusando bloquearía a las demás) y la constancia del consentimiento guardaría una IP
        // que no es de nadie. Solo se confía en proxies de la red interna: así el sistema toma la IP que
        // anotó el proxy y nadie puede hacerse pasar por otra mandando su propio X-Forwarded-For.
        $middleware->trustProxies(at: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '100.64.0.0/10', '127.0.0.1', '::1', 'fc00::/7']);

        // Este servidor solo ofrece el API: la web del sistema vive en otro sitio y las sesiones van con
        // tokens. Se quitan las sesiones y cookies de navegador de las rutas web: con ellas, cada visita
        // anónima a "/" guardaba una fila en la base de datos, sin ningún límite.
        $middleware->web(remove: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        ]);

        // Límite general de peticiones por cuenta o por IP (ver AppServiceProvider)
        $middleware->throttleApi();

        $middleware->api(
            // Antes que nada: cortar cuerpos exagerados
            prepend: [\App\Http\Middleware\LimitarTamanoPeticion::class],
            append: [
                // Una cuenta deshabilitada pierde el acceso al instante, aunque tuviera la sesión abierta
                \App\Http\Middleware\EnsureAccountEnabled::class,
                // Limpia de vez en cuando lo que ya venció (después de responder)
                \App\Http\Middleware\MantenimientoOportunista::class,
            ],
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
