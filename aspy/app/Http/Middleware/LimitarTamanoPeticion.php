<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Corta las peticiones con un cuerpo exagerado antes de que el sistema lo procese.
 *
 * Ningún formulario manda más de unos pocos KB; solo la subida de comprobantes y reportes necesita
 * varios MB (ver ArchivoPrivadoController). Sin esto, cualquiera podría mandar megas de datos a
 * cualquier ruta para ocupar memoria y procesador.
 */
class LimitarTamanoPeticion
{
    /** Máximo para todo lo que no sea una subida de archivos. */
    private const MAX_BYTES = 256 * 1024;

    public function handle(Request $request, Closure $next): Response
    {
        $esSubida = $request->isMethod('POST') && $request->is('api/archivos');
        $tamano = (int) $request->headers->get('Content-Length', '0');

        if (! $esSubida && $tamano > self::MAX_BYTES) {
            return response()->json(['message' => 'La petición es demasiado grande.'], 413);
        }

        return $next($request);
    }
}
