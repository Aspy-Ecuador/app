<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\IpUtils;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reconoce la IP real de cada persona detrás del proxy de la plataforma (Railway).
 *
 * Comprobado en el sitio publicado el 2026-10-08: la conexión llega desde la red interna de la
 * plataforma (100.64.x.x) y esta manda dos encabezados que ella misma escribe, pisando cualquier
 * valor que ponga el visitante:
 *   X-Real-IP:        la IP de la persona
 *   X-Forwarded-For:  "IP de la persona, IP del servidor de entrada de la plataforma"
 * La segunda IP de X-Forwarded-For cambia de una petición a otra; si el sistema la tomara (es lo que
 * hace la regla habitual, que usa la última de la lista), los límites por IP no servirían: una misma
 * persona caería cada vez en un contador distinto.
 *
 * Por eso, cuando la conexión viene de la red interna y hay X-Real-IP, esa es la IP que vale. Si
 * alguien llegara directo (sin el proxy), sus encabezados no se creen: vale su conexión real.
 */
class IpRealDetrasDelProxy
{
    /** Redes desde las que llega el proxy de la plataforma (son también los proxies de confianza de bootstrap/app.php). */
    public const RED_INTERNA = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '100.64.0.0/10', '127.0.0.1', '::1', 'fc00::/7'];

    public function handle(Request $request, Closure $next): Response
    {
        $real = trim((string) $request->headers->get('X-Real-IP'));
        $conexion = (string) $request->server('REMOTE_ADDR');

        if ($real !== '' && filter_var($real, FILTER_VALIDATE_IP) && $conexion !== '' && IpUtils::checkIp($conexion, self::RED_INTERNA)) {
            $request->headers->set('X-Forwarded-For', $real);
        }

        return $next($request);
    }
}
