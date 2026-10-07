<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use Illuminate\Http\Request;

/**
 * Manuales de uso (resources/manuales). No son públicos:
 * 1. Con sesión iniciada, GET /api/manuales/acceso entrega un pase firmado y temporal
 *    con los manuales que puede ver el rol.
 * 2. Los archivos se sirven en /api/manuales/archivo/{pase}/{ruta}. El pase va en la ruta
 *    (y no en un header) para que funcionen el iframe, las imágenes y la descarga del PDF,
 *    que el navegador pide solo con rutas relativas.
 */
class ManualController extends Controller
{
    /** Minutos que dura un pase. */
    private const VIGENCIA_MINUTOS = 120;

    /** Manual => roles que lo ven. Staff y Admin ven todos (hablan con pacientes y profesionales). */
    private const MANUALES = [
        'manual-familias' => [self::ROLE_CLIENT, self::ROLE_STAFF, self::ROLE_ADMIN],
        'manual-profesional' => [self::ROLE_PROFESSIONAL, self::ROLE_STAFF, self::ROLE_ADMIN],
        'manual-personal' => [self::ROLE_STAFF, self::ROLE_ADMIN],
        'manual-administrador' => [self::ROLE_STAFF, self::ROLE_ADMIN],
        'manual-pagina-web' => [self::ROLE_STAFF, self::ROLE_ADMIN],
    ];

    /** Carpeta de capturas => manual al que pertenece. */
    private const CARPETAS = [
        'familias' => 'manual-familias',
        'profesional' => 'manual-profesional',
        'personal' => 'manual-personal',
        'administrador' => 'manual-administrador',
        'pagina-web' => 'manual-pagina-web',
    ];

    /** Extensiones que se sirven (las mismas que acepta la ruta). */
    private const TIPOS = [
        'html' => 'text/html; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'js' => 'text/javascript; charset=utf-8',
        'jpg' => 'image/jpeg',
        'webp' => 'image/webp',
        'png' => 'image/png',
        'svg' => 'image/svg+xml',
        'pdf' => 'application/pdf',
    ];

    public function acceso(Request $request)
    {
        $user = $this->currentUser();
        if (! $user || ! $user->is_available) {
            return $this->forbidden();
        }

        $permitidos = array_keys(array_filter(
            self::MANUALES,
            fn (array $roles) => in_array((int) $user->role_id, $roles, true),
        ));
        $expira = now()->addMinutes(self::VIGENCIA_MINUTOS)->timestamp;

        return response()->json([
            'pase' => $this->firmar(['u' => $user->user_account_id, 'm' => $permitidos, 'e' => $expira]),
            'manuales' => $permitidos,
            'expira' => $expira,
        ]);
    }

    public function archivo(string $pase, string $ruta)
    {
        $datos = $this->verificar($pase);
        if ($datos === null) {
            return $this->rechazo('Este enlace del manual no es válido.');
        }
        if (! UserAccount::whereKey($datos['u'] ?? 0)->where('is_available', true)->exists()) {
            return $this->rechazo('Tu cuenta está deshabilitada. Comunícate con el administrador de la fundación.');
        }
        if ($datos['e'] < now()->timestamp) {
            return $this->rechazo('Este enlace del manual venció. Vuelve a abrirlo desde el sistema: menú ⋮ → Manual de uso.');
        }

        // Solo rutas simples dentro de la carpeta de manuales (sin "..", barras invertidas ni archivos ocultos)
        if (! preg_match('#^[a-z0-9-]+(/[a-z0-9-]+)*\.(html|css|js|jpg|webp|png|svg|pdf)$#', $ruta)) {
            abort(404);
        }

        $manual = $this->manualDeRuta($ruta);
        $esPortada = $ruta === 'index.html';
        $permitido = $esPortada
            ? count($datos['m']) === count(self::MANUALES) // la portada lista todos los manuales
            : $manual === null || in_array($manual, $datos['m'], true); // assets/ es común
        if (! $permitido) {
            return $this->rechazo('Tu cuenta no tiene acceso a este manual.');
        }

        $base = realpath(resource_path('manuales'));
        $archivo = realpath($base.DIRECTORY_SEPARATOR.$ruta);
        if (! $archivo || ! str_starts_with($archivo, $base.DIRECTORY_SEPARATOR) || ! is_file($archivo)) {
            abort(404);
        }

        return response()->file($archivo, [
            // Tipo exacto por extensión: la detección automática marca el CSS y el JS como texto
            'Content-Type' => self::TIPOS[pathinfo($archivo, PATHINFO_EXTENSION)],
            'Cache-Control' => 'private, max-age=3600',
            'Referrer-Policy' => 'no-referrer', // el pase no viaja a otros sitios
            'X-Robots-Tag' => 'noindex, nofollow',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /** Manual al que pertenece un archivo, o null si es común (assets/). */
    private function manualDeRuta(string $ruta): ?string
    {
        if (preg_match('#^(manual-[a-z-]+)\.html$#', $ruta, $m)) {
            return $m[1];
        }
        if (preg_match('#^pdf/(manual-[a-z-]+)\.pdf$#', $ruta, $m)) {
            return $m[1];
        }
        if (preg_match('#^img/([a-z-]+)/#', $ruta, $m)) {
            return self::CARPETAS[$m[1]] ?? 'desconocido';
        }
        if (str_starts_with($ruta, 'assets/')) {
            return null;
        }

        return 'desconocido';
    }

    private function firmar(array $datos): string
    {
        $carga = rtrim(strtr(base64_encode(json_encode($datos)), '+/', '-_'), '=');

        return $carga.'.'.hash_hmac('sha256', 'manuales|'.$carga, config('app.key'));
    }

    /** Datos del pase si la firma es correcta; null si fue alterado. */
    private function verificar(string $pase): ?array
    {
        [$carga, $firma] = array_pad(explode('.', $pase, 2), 2, '');
        if ($carga === '' || ! hash_equals(hash_hmac('sha256', 'manuales|'.$carga, config('app.key')), $firma)) {
            return null;
        }
        $datos = json_decode(base64_decode(strtr($carga, '-_', '+/')), true);

        return is_array($datos) && isset($datos['m'], $datos['e']) && is_array($datos['m']) ? $datos : null;
    }

    private function rechazo(string $mensaje)
    {
        $html = '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
            .'<title>Manual de uso · ASPY</title><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#fff8f1;'
            .'font:16px/1.6 Inter,system-ui,sans-serif;color:#12263a;padding:24px;box-sizing:border-box">'
            .'<p style="max-width:440px;text-align:center">'.e($mensaje).'</p></body></html>';

        return response($html, 403, [
            'Content-Type' => 'text/html; charset=utf-8',
            'Referrer-Policy' => 'no-referrer',
            'X-Robots-Tag' => 'noindex, nofollow',
        ]);
    }
}
