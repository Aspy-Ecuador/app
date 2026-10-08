<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentReportController;
use App\Http\Controllers\ArchivoPrivadoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\ConsentimientoController;
use App\Http\Controllers\ManualController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ProfessionalServiceController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\WorkerScheduleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfessionalController;

/*
| Permisos
| - 'role:x,y' (CheckRole) deja pasar a esos roles y SIEMPRE al Admin.
| - Lo que depende del dueño del registro (mis citas, mi perfil, mis pacientes)
|   se valida dentro de cada controlador.
| - Límites de intentos: todo el API tiene uno general ('throttle:api', en bootstrap/app.php) y las
|   rutas delicadas, el suyo ('throttle:login', 'registro', 'archivos-subir'...). Están en AppServiceProvider.
*/

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized, Redirected to Login']);
});

// Archivos de los manuales: los protege el pase firmado y temporal de /manuales/acceso
Route::get('/manuales/archivo/{pase}/{ruta}', [ManualController::class, 'archivo'])->where('ruta', '.*');

// Máx. 10 intentos de login por minuto (por IP + email) contra fuerza bruta
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    // Comprobación liviana de la sesión (la usa el frontend cada minuto; EnsureAccountEnabled corta las cuentas deshabilitadas)
    Route::get('/sesion', fn () => response()->noContent());
    // Datos bancarios para transferir: los lee cualquiera con sesión; solo el Admin los cambia
    Route::get('/bank-account', [BankAccountController::class, 'show']);
    Route::put('/bank-account', [BankAccountController::class, 'update'])->middleware('role:admin');
    // Manuales de uso: pase temporal con los manuales que puede ver el rol (ver ManualController)
    Route::get('/manuales/acceso', [ManualController::class, 'acceso']);
    // Política de privacidad: cada quien consulta y acepta la suya (primer ingreso de cuentas creadas desde el panel)
    Route::get('/consentimiento', [ConsentimientoController::class, 'show']);
    Route::post('/consentimiento', [ConsentimientoController::class, 'store']);
    // Retirar el consentimiento (pacientes y familias): deshabilita la cuenta y deja la constancia
    Route::post('/consentimiento/retirar', [ConsentimientoController::class, 'retirar']);
    // Comprobantes y reportes: se guardan en el servidor y solo los abre quien corresponde (ver ArchivoPrivadoController)
    Route::post('/archivos', [ArchivoPrivadoController::class, 'store'])->middleware('throttle:archivos-subir');
    Route::get('/archivos/resumen', [ArchivoPrivadoController::class, 'resumen']); // cuántos tiene subidos la cuenta y sus topes
    Route::get('/archivos/{id}', [ArchivoPrivadoController::class, 'show'])->whereNumber('id')->middleware('throttle:archivos-ver');
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Registro público: siempre crea un Cliente (el rol lo fija el servidor)
Route::prefix('user-account')->group(function () {
    Route::post('/registro', [UserAccountController::class, 'store'])->middleware('throttle:registro');
});

// UserAccount
Route::middleware('auth:sanctum')->prefix('user-account')->group(function () {
    Route::get('/', [UserAccountController::class, 'index'])->middleware('role:staff');
    Route::post('/crear', [UserAccountController::class, 'store'])->middleware('role:staff');
    Route::get('/{id}', [UserAccountController::class, 'show']);   // dueño o staff
    Route::put('/{id}', [UserAccountController::class, 'update']); // dueño o staff
    Route::delete('/{id}', [UserAccountController::class, 'destroy'])->middleware('role:staff');
});

// Person
Route::middleware('auth:sanctum')->prefix('person')->group(function () {
    Route::get('/', [PersonController::class, 'index']);         // filtrado por rol
    Route::get('/{id}', [PersonController::class, 'show']);      // dueño, su profesional o staff
    Route::post('/', [PersonController::class, 'store'])->middleware('role:staff');
    Route::put('/{id}', [PersonController::class, 'update']);    // dueño o staff
    Route::delete('/{id}', [PersonController::class, 'destroy'])->middleware('role:staff');
    Route::patch('/{id}/available', [PersonController::class, 'changeAvailable'])->middleware('role:staff');
});

// Professional
Route::middleware('auth:sanctum')->prefix('professional')->group(function () {
    Route::post("/create-horario", [ProfessionalController::class, 'createHorario'])->middleware(['role:professional,staff', 'throttle:horarios']);
});

// WorkerSchedule (la lista es necesaria para agendar citas)
Route::middleware('auth:sanctum')->prefix('worker-schedule')->group(function () {
    Route::get('/', [WorkerScheduleController::class, 'index']);
    Route::get('/{id}', [WorkerScheduleController::class, 'show']);
    Route::post('/', [WorkerScheduleController::class, 'store'])->middleware('role:staff');
    Route::put('/{id}', [WorkerScheduleController::class, 'update'])->middleware('role:professional,staff');
    Route::delete('/{id}', [WorkerScheduleController::class, 'destroy'])->middleware('role:professional,staff');
});

// Service (lectura para todos, cambios solo staff/admin)
Route::middleware('auth:sanctum')->prefix('service')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);
    Route::get('/{id}', [ServiceController::class, 'show']);
    Route::post('/', [ServiceController::class, 'store'])->middleware('role:staff');
    Route::put('/{id}', [ServiceController::class, 'update'])->middleware('role:staff');
    Route::delete('/{id}', [ServiceController::class, 'destroy'])->middleware('role:staff');
    Route::patch('/{id}/available', [ServiceController::class, 'changeAvailable'])->middleware('role:staff');
});

// ProfessionalService
Route::middleware('auth:sanctum')->prefix('professional-service')->group(function () {
    Route::get('/', [ProfessionalServiceController::class, 'index']);
    Route::get('/{id}', [ProfessionalServiceController::class, 'show']);
    Route::post('/', [ProfessionalServiceController::class, 'store'])->middleware('role:staff');
    Route::put('/{id}', [ProfessionalServiceController::class, 'update'])->middleware('role:staff');
    Route::delete('/{id}', [ProfessionalServiceController::class, 'destroy'])->middleware('role:staff');
});

// Payment (lectura filtrada por dueño, cambios solo staff/admin)
Route::middleware('auth:sanctum')->prefix('payment')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::get('/{id}', [PaymentController::class, 'show']);
    Route::post('/', [PaymentController::class, 'store'])->middleware('role:staff');
    Route::put('/{id}', [PaymentController::class, 'update'])->middleware('role:staff');
    Route::delete('/{id}', [PaymentController::class, 'destroy'])->middleware('role:staff');
});

// Appointment
Route::middleware('auth:sanctum')->prefix('appointment')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']); // filtrado por rol
    Route::post('/appointment-create', [AppointmentController::class, 'createAppointment'])->middleware('role:client,staff');
    Route::put('/appointment-reject', [AppointmentController::class, 'rejectAppointment'])->middleware('role:staff');
    Route::put('/appointment-approve', [AppointmentController::class, 'approveAppointment'])->middleware('role:staff');
    Route::put('/appointment-complete', [AppointmentController::class, 'completeAppointment'])->middleware('role:professional,staff');
    Route::put('/appointment-missed', [AppointmentController::class, 'missedAppointment'])->middleware('role:professional,staff');
    Route::put('/appointment-cancel', [AppointmentController::class, 'cancelAppointment'])->middleware('role:client,staff');
    Route::post('/create-report', [AppointmentController::class, 'createReport'])->middleware('role:professional');
});

// AppointmentReport (información clínica: lectura filtrada, cambios solo admin)
Route::middleware('auth:sanctum')->prefix('appointment-report')->group(function () {
    Route::get('/', [AppointmentReportController::class, 'index']);
    Route::get('/{id}', [AppointmentReportController::class, 'show']);
    Route::post('/', [AppointmentReportController::class, 'store'])->middleware('role:admin');
    Route::put('/{id}', [AppointmentReportController::class, 'update'])->middleware('role:admin');
    Route::delete('/{id}', [AppointmentReportController::class, 'destroy'])->middleware('role:admin');
});
