<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * Comprobante de pago o reporte de sesión guardado en el servidor.
 *
 * El contenido se guarda cifrado (AES-256-GCM) con una clave derivada de APP_KEY: quien obtenga solo
 * una copia de la base de datos no puede leer los archivos. Por lo mismo, si APP_KEY cambia, los
 * archivos guardados dejan de poder abrirse: no la cambies sin respaldar antes.
 */
class ArchivoPrivado extends Model
{
    public const COMPROBANTE = 'comprobante';

    public const REPORTE = 'reporte';

    /** Archivos sin usar (subidos, pero todavía de ninguna cita ni reporte) que guarda una cuenta: al subir otro se borra el más antiguo. */
    public const MAX_SIN_USAR = 5;

    /** Horas que se conserva un archivo que nadie usó. */
    public const HORAS_SIN_USAR = 24;

    /** Prefijo con que payment_data.file y appointment_report.file apuntan a un archivo privado. */
    public const PREFIJO = 'privado:';

    private const CIFRADO = 'aes-256-gcm';

    protected $table = 'archivo_privado';

    protected $primaryKey = 'archivo_privado_id';

    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'nombre',
        'mime',
        'tamano',
        'contenido',
        'subido_por',
        'payment_data_id',
        'appointment_report_id',
        'creation_date',
        'eliminar_el',
    ];

    // El contenido no viaja nunca en un listado ni en una respuesta JSON
    protected $hidden = ['contenido'];

    protected $casts = [
        'creation_date' => 'datetime',
        'eliminar_el' => 'datetime',
    ];

    public function paymentData()
    {
        return $this->belongsTo(PaymentData::class, 'payment_data_id', 'payment_data_id');
    }

    public function appointmentReport()
    {
        return $this->belongsTo(AppointmentReport::class, 'appointment_report_id', 'appointment_report_id');
    }

    /** Subidos, pero todavía de ninguna cita ni reporte. */
    public function scopeSinUsar($query)
    {
        return $query->whereNull('payment_data_id')->whereNull('appointment_report_id');
    }

    /** Borra los que nadie usó en HORAS_SIN_USAR (de cualquier cuenta). */
    public static function borrarSinUsarVencidos(): int
    {
        return self::sinUsar()->where('creation_date', '<', now()->subHours(self::HORAS_SIN_USAR))->delete();
    }

    /**
     * Borra los archivos cuya fecha de eliminación ya llegó (comprobantes de pagos rechazados, pasados
     * los días que eligió el Admin; ver Ajuste) y deja el pago sin comprobante. Devuelve cuántos borró.
     */
    public static function borrarProgramados(): int
    {
        $vencidos = self::whereNotNull('eliminar_el')
            ->where('eliminar_el', '<=', now())
            ->limit(200)
            ->get(['archivo_privado_id', 'payment_data_id']);
        if ($vencidos->isEmpty()) {
            return 0;
        }

        $comprobantes = $vencidos->pluck('payment_data_id')->filter();
        if ($comprobantes->isNotEmpty()) {
            PaymentData::whereIn('payment_data_id', $comprobantes)->update(['file' => null, 'modification_date' => now()]);
        }

        return self::whereIn('archivo_privado_id', $vencidos->pluck('archivo_privado_id'))->delete();
    }

    /** Todo menos el contenido (que puede pesar varios MB): para revisar permisos o vincular. */
    public function scopeSinContenido($query)
    {
        return $query->select([
            'archivo_privado_id', 'tipo', 'nombre', 'mime', 'tamano', 'subido_por',
            'payment_data_id', 'appointment_report_id', 'creation_date', 'eliminar_el',
        ]);
    }

    /**
     * Archivo recién subido por esta cuenta, del tipo esperado y todavía sin usar: el único que se
     * puede adjuntar a una cita o a un reporte. Devuelve null si la referencia no sirve.
     */
    public static function disponible(?string $referencia, string $tipo, $cuentaId): ?self
    {
        $id = self::idDe($referencia);
        if ($id === null) {
            return null;
        }

        return self::sinContenido()
            ->whereKey($id)
            ->where('tipo', $tipo)
            ->where('subido_por', $cuentaId)
            ->whereNull('payment_data_id')
            ->whereNull('appointment_report_id')
            ->first();
    }

    /** Lo une a su comprobante o reporte. Devuelve false si otro pedido lo usó primero. */
    public function vincular(string $columna, int $id): bool
    {
        return self::whereKey($this->archivo_privado_id)
            ->whereNull('payment_data_id')
            ->whereNull('appointment_report_id')
            ->update([$columna => $id]) === 1;
    }

    /** Valor que se guarda en payment_data.file o appointment_report.file. */
    public function referencia(): string
    {
        return self::PREFIJO.$this->archivo_privado_id;
    }

    /** Id del archivo al que apunta una referencia "privado:123" (null si no lo es). */
    public static function idDe(?string $referencia): ?int
    {
        return preg_match('/^'.self::PREFIJO.'(\d{1,9})$/', (string) $referencia, $m) ? (int) $m[1] : null;
    }

    public function estaVinculado(): bool
    {
        return $this->payment_data_id !== null || $this->appointment_report_id !== null;
    }

    public static function cifrar(string $bytes): string
    {
        $iv = random_bytes(12);
        $cifrado = openssl_encrypt($bytes, self::CIFRADO, self::clave(), OPENSSL_RAW_DATA, $iv, $sello);
        if ($cifrado === false) {
            throw new RuntimeException('No se pudo cifrar el archivo.');
        }

        return base64_encode($iv.$sello.$cifrado);
    }

    public static function descifrar(string $contenido): string
    {
        $crudo = base64_decode($contenido, true);
        if ($crudo === false || strlen($crudo) < 28) {
            throw new RuntimeException('El archivo guardado está dañado.');
        }
        $bytes = openssl_decrypt(substr($crudo, 28), self::CIFRADO, self::clave(), OPENSSL_RAW_DATA, substr($crudo, 0, 12), substr($crudo, 12, 16));
        if ($bytes === false) {
            throw new RuntimeException('No se pudo descifrar el archivo (¿cambió APP_KEY?).');
        }

        return $bytes;
    }

    /** Clave propia de los archivos, derivada de APP_KEY (no se usa APP_KEY directamente). */
    private static function clave(): string
    {
        $appKey = (string) config('app.key');
        if ($appKey === '') {
            throw new RuntimeException('Falta APP_KEY: no se pueden cifrar archivos.');
        }
        if (str_starts_with($appKey, 'base64:')) {
            $appKey = base64_decode(substr($appKey, 7));
        }

        return hash_hmac('sha256', 'aspy-archivos-privados', $appKey, true);
    }
}
