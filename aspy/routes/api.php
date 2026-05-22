<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ProfessionalServiceController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\WorkerScheduleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfessionalController;

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized, Redirected to Login']);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Register
Route::prefix('user-account')->group(function () {
    Route::post('/registro', [UserAccountController::class, 'store']);
});

// UserAccount
Route::middleware('auth:sanctum')->prefix('user-account')->group(function () {
    Route::get('/', [UserAccountController::class, 'index']);
    Route::post('/crear', [UserAccountController::class, 'store']);
    Route::get('/{id}', [UserAccountController::class, 'show']);
    Route::put('/{id}', [UserAccountController::class, 'update']);
    Route::delete('/{id}', [UserAccountController::class, 'destroy']);
});

// Person
Route::middleware('auth:sanctum')->prefix('person')->group(function () {
    Route::get('/', [PersonController::class, 'index']);
    Route::get('/{id}', [PersonController::class, 'show']);
    Route::post('/', [PersonController::class, 'store']);
    Route::put('/{id}', [PersonController::class, 'update']);
    Route::delete('/{id}', [PersonController::class, 'destroy']);
});

// Professional
Route::middleware('auth:sanctum')->prefix('professional')->group(function () {
    Route::post("/create-horario", [ProfessionalController::class, 'createHorario']);
});

// WorkerSchedule
Route::middleware('auth:sanctum')->prefix('worker-schedule')->group(function () {
    Route::get('/', [WorkerScheduleController::class, 'index']);
    Route::get('/{id}', [WorkerScheduleController::class, 'show']);
    Route::post('/', [WorkerScheduleController::class, 'store']);
    Route::put('/{id}', [WorkerScheduleController::class, 'update']);
    Route::delete('/{id}', [WorkerScheduleController::class, 'destroy']);
});

// Service
Route::middleware('auth:sanctum')->prefix('service')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);
    Route::get('/{id}', [ServiceController::class, 'show']);
    Route::post('/', [ServiceController::class, 'store']);
    Route::put('/{id}', [ServiceController::class, 'update']);
    Route::delete('/{id}', [ServiceController::class, 'destroy']);
});

// ProfessionalService
Route::middleware('auth:sanctum')->prefix('professional-service')->group(function () {
    Route::get('/', [ProfessionalServiceController::class, 'index']);
    Route::get('/{id}', [ProfessionalServiceController::class, 'show']);
    Route::post('/', [ProfessionalServiceController::class, 'store']);
    Route::put('/{id}', [ProfessionalServiceController::class, 'update']);
    Route::delete('/{id}', [ProfessionalServiceController::class, 'destroy']);
});


// Payment
Route::middleware('auth:sanctum')->prefix('payment')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::get('/{id}', [PaymentController::class, 'show']);
    Route::post('/', [PaymentController::class, 'store']);
    Route::put('/{id}', [PaymentController::class, 'update']);
    Route::delete('/{id}', [PaymentController::class, 'destroy']);
});

// Appointment
Route::middleware('auth:sanctum')->prefix('appointment')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']);
    Route::post('/appointment-create', [AppointmentController::class, 'createAppointment']);
    Route::put('/appointment-reject', [AppointmentController::class, 'rejectAppointment']);
    Route::put('/appointment-approve', [AppointmentController::class, 'approveAppointment']);
    Route::put('/appointment-complete', [AppointmentController::class, 'completeAppointment']);
    Route::put('/appointment-missed', [AppointmentController::class, 'missedAppointment']);
    Route::post('/create-report', [AppointmentController::class, 'createReport']);
});

// AppointmentReport
Route::middleware('auth:sanctum')->prefix('appointment-report')->group(function () {
    Route::get('/', [AppointmentReportController::class, 'index']);
    Route::get('/{id}', [AppointmentReportController::class, 'show']);
    Route::post('/', [AppointmentReportController::class, 'store']);
    Route::put('/{id}', [AppointmentReportController::class, 'update']);
    Route::delete('/{id}', [AppointmentReportController::class, 'destroy']);
});