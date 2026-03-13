<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\ProfessionalController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentReportController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\WorkerScheduleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ProfessionalServiceController;

// Rutas públicas (sin autenticación)
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren autenticación con Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User Account routes
    Route::apiResource('user-accounts', UserAccountController::class);
    
    // Person routes
    Route::apiResource('persons', PersonController::class);
    
    // Client routes
    Route::apiResource('clients', ClientController::class);
    
    // Staff routes
    Route::apiResource('staff', StaffController::class);
    
    // Professional routes
    Route::apiResource('professionals', ProfessionalController::class);
    
    // Appointment routes
    Route::apiResource('appointments', AppointmentController::class);
    
    // Appointment Report routes
    Route::apiResource('appointment-reports', AppointmentReportController::class);
    
    // Payment routes
    Route::apiResource('payments', PaymentController::class);
    
    // Schedule routes
    Route::apiResource('schedules', ScheduleController::class);
    
    // Worker Schedule routes
    Route::apiResource('worker-schedules', WorkerScheduleController::class);

    // Service routes
    Route::apiResource('services', ServiceController::class);

    // Professional Service routes (servicios con profesionales en cascada)
    Route::apiResource('professional-services', ProfessionalServiceController::class);

});