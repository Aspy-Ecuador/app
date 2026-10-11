<?php

// FINAL

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointment';

    protected $primaryKey = 'appointment_id';

    protected $fillable = [
        'payment_id',
        'client_id',
        'professional_id',
        'worker_schedule_id',
        'appointment_status_id',
        'service_id',
        'created_by',
        'modified_by',
    ];

    /**
     * El enlace de la reunión no sale al serializar el modelo: lo entrega solo AppointmentController
     * (`datosVirtuales`), que decide si quien pregunta lo puede ver.
     */
    protected $hidden = ['enlace_virtual'];

    /**
     * Servicios de videollamada que se aceptan en `enlace_virtual`: nombre, si se admiten subdominios
     * (Zoom usa us02web.zoom.us y similares) y con qué empieza la ruta del enlace de una reunión.
     * No se acepta cualquier enlace, ni cualquier página de esos servicios (algunas redirigen a otros
     * sitios): el paciente lo abre con confianza porque se lo muestra la fundación.
     * Deben coincidir con `PLATAFORMAS` de aspy-web/src/utils/citaVirtual.ts.
     */
    public const PLATAFORMAS_VIRTUALES = [
        'zoom.us' => ['Zoom', true, ['/j/', '/my/', '/s/', '/w/', '/wc/', '/meeting/']],
        'teams.microsoft.com' => ['Microsoft Teams', false, ['/l/meetup-join/', '/meet/', '/v2/']],
        'teams.live.com' => ['Microsoft Teams', false, ['/meet/']],
        'meet.google.com' => ['Google Meet', false, ['/lookup/']],
    ];

    /** Google Meet: además, el código de la reunión va directo en la ruta (/abc-defg-hij). */
    private const CODIGO_DE_MEET = '/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/iD';

    /** Nombre del servicio si el enlace es el de una reunión de uno de los servicios aceptados; si no, null. */
    public static function plataformaVirtual(?string $enlace): ?string
    {
        $enlace = trim((string) $enlace);
        // Solo https, un dominio bien formado y, después, caracteres ASCII visibles sin los que un navegador
        // podría leer de otra forma (\ " ' < > `). Así tampoco entran espacios, caracteres de control ni bytes inválidos.
        if (! preg_match('/^https:\/\/(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:[\/?#][\x21\x23-\x26\x28-\x3B\x3D\x3F-\x5B\x5D-\x5F\x61-\x7E]*)?$/iD', $enlace)) {
            return null;
        }
        $partes = parse_url($enlace);
        if (! is_array($partes) || isset($partes['user']) || isset($partes['pass']) || isset($partes['port'])) {
            return null;
        }
        $dominio = strtolower($partes['host'] ?? '');
        $ruta = strtolower($partes['path'] ?? '/');
        // Sin segmentos "." ni ".." (tampoco escritos como %2e): el navegador los resuelve y abriría otra página
        if (preg_match('#(?:^|/)(?:\.|%2e){1,2}(?:/|$)#i', $ruta)) {
            return null;
        }
        foreach (self::PLATAFORMAS_VIRTUALES as $aceptado => [$nombre, $conSubdominios, $rutas]) {
            if ($dominio !== $aceptado && ! ($conSubdominios && str_ends_with($dominio, '.'.$aceptado))) {
                continue;
            }
            foreach ($rutas as $comienzo) {
                if (str_starts_with($ruta, $comienzo)) {
                    return $nombre;
                }
            }

            return $aceptado === 'meet.google.com' && preg_match(self::CODIGO_DE_MEET, $ruta) ? $nombre : null;
        }

        return null;
    }

    protected $casts = [
        'creation_date' => 'datetime',
        'modification_date' => 'datetime',
    ];

    public const CREATED_AT = 'creation_date';

    public const UPDATED_AT = 'modification_date';

    // Desactiva el manejo automático de timestamps
    public $timestamps = false;

    // Maneja las fechas manualmente en los eventos del modelo
    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->creation_date = now();
            $model->modification_date = null;
        });

        static::updating(function ($model) {
            $model->modification_date = now();
        });
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'payment_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'person_id');
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class, 'professional_id', 'person_id');
    }

    public function workerSchedule()
    {
        return $this->belongsTo(WorkerSchedule::class, 'worker_schedule_id', 'worker_schedule_id');
    }

    public function appointmentStatus()
    {
        return $this->belongsTo(AppointmentStatus::class, 'appointment_status_id', 'appointment_status_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'service_id');
    }

    public function report()
    {
        return $this->hasOne(AppointmentReport::class, 'appointment_id', 'appointment_id');
    }
}