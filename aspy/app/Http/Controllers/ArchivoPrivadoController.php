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
 */
class ArchivoPrivadoController extends Controller
{
    /** Tamaño máximo en KB (nginx.conf y el Dockerfile dejan pasar hasta 12 MB por petición). */
    private const MAX_KB = 8192;

    /** Tipos aceptados: la extensión se deduce del contenido, no del nombre que manda el navegador. */
    private const TIPOS = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'pdf' => 'application/pdf',
    ];

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
            // Limpieza: lo que esta persona subió hace más de un día y nunca usó
            ArchivoPrivado::where('subido_por', auth()->id())
                ->whereNull('payment_data_id')
                ->whereNull('appointment_report_id')
                ->where('creation_date', '<', now()->subDay())
                ->delete();

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

            return response()->json(['archivo' => $archivo->referencia()], 201);
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

    /** Deja constancia de quién subió o abrió el archivo. */
    private function registrar(int $archivoId, string $accion): void
    {
        DB::table('archivo_privado_acceso')->insert([
            'archivo_privado_id' => $archivoId,
            'user_account_id' => auth()->id(),
            'accion' => $accion,
            'creation_date' => now(),
        ]);
    }
}
