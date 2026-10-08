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
        // llegan con la IP del proxy: los límites de intentos por IP no distinguirían a nadie y la constancia
        // del consentimiento guardaría una IP que no es de la persona. Solo se confía en la red interna de la
        // plataforma, y la IP de cada persona se toma del encabezado que la plataforma misma escribe
        // (ver IpRealDetrasDelProxy): nadie puede hacerse pasar por otra IP mandando sus propios encabezados.
        $middleware->trustProxies(at: \App\Http\Middleware\IpRealDetrasDelProxy::RED_INTERNA);
        $middleware->prepend(\App\Http\Middleware\IpRealDetrasDelProxy::class);

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
