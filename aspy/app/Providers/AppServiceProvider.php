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
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Login: máx. 10 intentos por minuto por combinación email + IP
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(10)->by(strtolower((string) $request->input('email')).'|'.$request->ip());
        });
    }
}
