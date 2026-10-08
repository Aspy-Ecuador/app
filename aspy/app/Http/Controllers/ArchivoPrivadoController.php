<?php

namespace App\Http\Controllers;

use App\Models\ArchivoPrivado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Comprobantes de pago y reportes de sesión: se guardan en el servidor y solo se entregan con sesión
 * iniciada y a quien le corresponde.
 *
 * - Comprobante: lo ven el paciente que pagó, Secretaría y el Admin.
 * - Reporte (información clínica): lo ven el paciente de la cita, el profesional que la atendió y el
 *   Admin. Secretaría NO.
 * - Recién subido y todavía sin usar en una cita o reporte: solo quien lo subió (y el Admin).
 *
 * Para que nadie pueda llenar la base de datos subiendo archivos:
 * - cada archivo pesa como máximo 8 MB y tiene que ser una imagen o un PDF de verdad;
 * - una cuenta guarda como máximo MAX_SIN_USAR archivos sin usar (al subir otro se borra el más antiguo);
 * - los que nadie usó se borran al día siguiente;
 * - hay un máximo de subidas por día por cuenta y uno de espacio total para archivos sin usar.
 */
class ArchivoPrivadoController extends Controller
{
    /** Tamaño máximo en KB (nginx.conf y el Dockerfile dejan pasar hasta 12 MB por petición). */
    private const MAX_KB = 8192;

    /** Subidas por día: una familia sube uno por cita; Secretaría y los profesionales, muchos más. */
    private const MAX_POR_DIA_PACIENTE = 30;

    private const MAX_POR_DIA_PERSONAL = 300;

    /** Espacio total para archivos que todavía no son de ninguna cita ni reporte (todas las cuentas). */
    private const MAX_BYTES_SIN_USAR = 300 * 1024 * 1024;

    /** Tipos aceptados: la extensión se deduce del contenido, no del nombre que manda el navegador. */
    private const TIPOS = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'pdf' => 'application/pdf',
    ];

    /** Cuántos archivos tiene subidos la cuenta y cuáles son sus topes (la web se lo muestra). */
    public function resumen()
    {
        return response()->json($this->resumenDeLaCuenta());
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|in:'.ArchivoPrivado::COMPROBANTE.','.ArchivoPrivado::REPORTE,
        ]);
        $tipo = $request->input('tipo');

        // El reporte lo sube el profesional; el comprobante, quien agenda (paciente o Secretaría)
        $permitido = $tipo === ArchivoPrivado::REPORTE
            ? $this->isProfessional() || $this->isAdmin()
            : $this->isClient() || $this->isStaffOrAdmin();
        if (! $permitido) {
            return $this->forbidden();
        }

        $formatos = $tipo === ArchivoPrivado::REPORTE ? 'pdf' : 'jpg,jpeg,png,webp,pdf';
        $request->validate([
            'archivo' => 'required|file|max:'.self::MAX_KB.'|mimes:'.$formatos,
        ], [
            'archivo.required' => 'Falta el archivo.',
            'archivo.file' => 'El archivo no llegó completo. Intenta de nuevo.',
            'archivo.uploaded' => 'El archivo no llegó completo. Puede que pese demasiado (máximo 8 MB).',
            'archivo.max' => 'El archivo pesa demasiado (máximo 8 MB).',
            'archivo.mimes' => $tipo === ArchivoPrivado::REPORTE
                ? 'El reporte debe ser un PDF.'
                : 'El comprobante debe ser una imagen (JPG, PNG o WebP) o un PDF.',
        ]);

        $subido = $request->file('archivo');
        $mime = self::TIPOS[$subido->guessExtension() ?? ''] ?? null;
        if ($mime === null) {
            return response()->json(['message' => 'Ese tipo de archivo no se acepta.'], 422);
        }

        try {
            // Lo que nadie usó en un día se borra (de cualquier cuenta), y también lo que ya tenía fecha de eliminación
            ArchivoPrivado::borrarSinUsarVencidos();
            ArchivoPrivado::borrarProgramados();

            $resumen = $this->resumenDeLaCuenta();
            if ($resumen['hoy'] >= $resumen['maximo_por_dia']) {
                return response()->json([
                    'message' => "Hoy ya subiste {$resumen['hoy']} archivos, que es el máximo por día. Podrás subir más mañana.",
                ] + $resumen, 429);
            }

            if (! $this->hayEspacioParaSinUsar()) {
                return response()->json(['message' => 'El sistema está recibiendo demasiados archivos en este momento. Inténtalo de nuevo en unos minutos.'], 503);
            }

            $archivo = ArchivoPrivado::create([
                'tipo' => $tipo,
                'nombre' => mb_substr(preg_replace('/[^\pL\pN _.()-]/u', '', $subido->getClientOriginalName()) ?: 'archivo', 0, 200),
                'mime' => $mime,
                'tamano' => $subido->getSize(),
                'contenido' => ArchivoPrivado::cifrar($subido->getContent()),
                'subido_por' => auth()->id(),
                'creation_date' => now(),
            ]);
            $this->registrar($archivo->archivo_privado_id, 'subir');

            // Tope de archivos sin usar por cuenta: se conservan los más nuevos
            $sobran = ArchivoPrivado::sinUsar()
                ->where('subido_por', auth()->id())
                ->orderByDesc('archivo_privado_id')
                ->skip(ArchivoPrivado::MAX_SIN_USAR)
                ->take(1000)
                ->pluck('archivo_privado_id');
            $reemplazados = $sobran->isEmpty() ? 0 : ArchivoPrivado::whereIn('archivo_privado_id', $sobran)->delete();

            return response()->json([
                'archivo' => $archivo->referencia(),
                // Cuántos de sus archivos sin usar se borraron para hacerle lugar a este
                'reemplazados' => $reemplazados,
            ] + $this->resumenDeLaCuenta(), 201);
        } catch (\Throwable $e) {
            return $this->serverError('No se pudo guardar el archivo.', $e);
        }
    }

    public function show($id)
    {
        // Primero los datos (sin el contenido) para decidir si esta persona puede verlo
        $archivo = ArchivoPrivado::sinContenido()->with(['paymentData', 'appointmentReport.appointment'])->findOrFail($id);

        if (! $this->puedeVer($archivo)) {
            return $this->forbidden();
        }

        // Comprobante de un pago rechazado cuyo día de gracia ya pasó: se borra y ya no se entrega
        if ($archivo->eliminar_el && $archivo->eliminar_el->isPast()) {
            ArchivoPrivado::borrarProgramados();
            abort(404);
        }

        try {
            $bytes = ArchivoPrivado::descifrar((string) ArchivoPrivado::whereKey($archivo->archivo_privado_id)->value('contenido'));
            $this->registrar($archivo->archivo_privado_id, 'ver');
        } catch (\Throwable $e) {
            return $this->serverError('No se pudo abrir el archivo.', $e);
        }

        $extension = array_search($archivo->mime, self::TIPOS, true) ?: 'bin';

        return response($bytes, 200, [
            'Content-Type' => $archivo->mime,
            'Content-Length' => (string) strlen($bytes),
            'Content-Disposition' => 'inline; filename="'.$archivo->tipo.'-'.$archivo->archivo_privado_id.'.'.$extension.'"',
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function puedeVer(ArchivoPrivado $archivo): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        $yo = $this->currentPersonId();

        if ($archivo->tipo === ArchivoPrivado::REPORTE) {
            $cita = $archivo->appointmentReport?->appointment;
            if (! $cita) {
                return (int) $archivo->subido_por === (int) auth()->id();
            }

            return ($this->isProfessional() && (int) $cita->professional_id === $yo)
                || ($this->isClient() && (int) $cita->client_id === $yo);
        }

        $comprobante = $archivo->paymentData;
        if (! $comprobante) {
            return (int) $archivo->subido_por === (int) auth()->id();
        }

        return $this->isStaffOrAdmin()
            || ($this->isClient() && (int) $comprobante->client_id === $yo);
    }

    private function resumenDeLaCuenta(): array
    {
        return [
            'sin_usar' => ArchivoPrivado::sinUsar()->where('subido_por', auth()->id())->count(),
            'maximo_sin_usar' => ArchivoPrivado::MAX_SIN_USAR,
            'hoy' => DB::table('archivo_privado_acceso')
                ->where('user_account_id', auth()->id())
                ->where('accion', 'subir')
                ->where('creation_date', '>=', now()->startOfDay())
                ->count(),
            'maximo_por_dia' => $this->isClient() ? self::MAX_POR_DIA_PACIENTE : self::MAX_POR_DIA_PERSONAL,
        ];
    }

    /**
     * ¿Queda espacio para otro archivo sin usar? Si entre todas las cuentas ya se pasó el máximo, se
     * borran los más antiguos (de más de 10 minutos: los recién subidos están por usarse). Si aun así
     * no alcanza, alguien está subiendo archivos en masa y no se acepta ninguno más por ahora.
     */
    private function hayEspacioParaSinUsar(): bool
    {
        $total = (int) ArchivoPrivado::sinUsar()->sum('tamano');
        if ($total <= self::MAX_BYTES_SIN_USAR) {
            return true;
        }

        $antiguos = ArchivoPrivado::sinUsar()
            ->where('creation_date', '<', now()->subMinutes(10))
            ->orderBy('archivo_privado_id')
            ->limit(500)
            ->get(['archivo_privado_id', 'tamano']);

        foreach ($antiguos as $antiguo) {
            ArchivoPrivado::whereKey($antiguo->archivo_privado_id)->delete();
            $total -= (int) $antiguo->tamano;
            if ($total <= self::MAX_BYTES_SIN_USAR) {
                return true;
            }
        }

        return false;
    }

    /** Deja constancia de quién subió o abrió el archivo (abrirlo varias veces seguidas cuenta una vez). */
    private function registrar(int $archivoId, string $accion): void
    {
        if ($accion === 'ver') {
            $reciente = DB::table('archivo_privado_acceso')
                ->where('archivo_privado_id', $archivoId)
                ->where('user_account_id', auth()->id())
                ->where('accion', 'ver')
                ->where('creation_date', '>=', now()->subMinutes(10))
                ->exists();
            if ($reciente) {
                return;
            }
        }

        DB::table('archivo_privado_acceso')->insert([
            'archivo_privado_id' => $archivoId,
            'user_account_id' => auth()->id(),
            'accion' => $accion,
            'creation_date' => now(),
        ]);
    }
}
