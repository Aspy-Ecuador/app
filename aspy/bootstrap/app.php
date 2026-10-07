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
        // Una cuenta deshabilitada pierde el acceso al instante, aunque tuviera la sesión abierta
        $middleware->api(append: [\App\Http\Middleware\EnsureAccountEnabled::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
