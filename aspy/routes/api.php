<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AgaController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentReportController;
use App\Http\Controllers\AppointmentStatusController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\IdentificationController;
use App\Http\Controllers\MaritalStatusController;
use App\Http\Controllers\MedicalProfileController;
use App\Http\Controllers\OccupationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentDataController;
use App\Http\Controllers\PaymentStatusController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\PhoneController;
use App\Http\Controllers\ProfessionalController;
use App\Http\Controllers\ProfessionalServiceController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\UserAccountStatusController;
use App\Http\Controllers\WorkerScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized, Redirected to Login']);
})->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Role
Route::middleware('auth:sanctum')->prefix('role')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::get('/{id}', [RoleController::class, 'show']);
    Route::post('/', [RoleController::class, 'store']);
    Route::put('/{id}', [RoleController::class, 'update']);
    Route::delete('/{id}', [RoleController::class, 'destroy']);
});

// UserAccount
Route::prefix('user-account')->group(function () {
    Route::post('/', [UserAccountController::class, 'store']);
});

// UserAccount
Route::middleware('auth:sanctum')->prefix('user-account')->group(function () {
    Route::get('/', [UserAccountController::class, 'index']);
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

// Client
Route::middleware('auth:sanctum')->prefix('client')->group(function () {
    Route::get('/', [ClientController::class, 'index']);
    Route::get('/{id}', [ClientController::class, 'show']);
    Route::post('/', [ClientController::class, 'store']);
    Route::put('/{id}', [ClientController::class, 'update']);
    Route::delete('/{id}', [ClientController::class, 'destroy']);
});

// Staff
Route::middleware('auth:sanctum')->prefix('staff')->group(function () {
    Route::get('/', [StaffController::class, 'index']);
    Route::get('/{id}', [StaffController::class, 'show']);
    Route::post('/', [StaffController::class, 'store']);
    Route::put('/{id}', [StaffController::class, 'update']);
    Route::delete('/{id}', [StaffController::class, 'destroy']);
});

// Professional
Route::middleware('auth:sanctum')->prefix('professional')->group(function () {
    Route::get('/', [ProfessionalController::class, 'index']);
    Route::get('/{id}', [ProfessionalController::class, 'show']);
    Route::post('/', [ProfessionalController::class, 'store']);
    Route::put('/{id}', [ProfessionalController::class, 'update']);
    Route::delete('/{id}', [ProfessionalController::class, 'destroy']);
});

// Address
Route::middleware('auth:sanctum')->prefix('address')->group(function () {
    Route::get('/', [AddressController::class, 'index']);
    Route::get('/{id}', [AddressController::class, 'show']);
    Route::post('/', [AddressController::class, 'store']);
    Route::put('/{id}', [AddressController::class, 'update']);
    Route::delete('/{id}', [AddressController::class, 'destroy']);
});



// Schedule
Route::middleware('auth:sanctum')->prefix('schedule')->group(function () {
    Route::get('/', [ScheduleController::class, 'index']);
    Route::get('/{id}', [ScheduleController::class, 'show']);
    Route::post('/', [ScheduleController::class, 'store']);
    Route::put('/{id}', [ScheduleController::class, 'update']);
    Route::delete('/{id}', [ScheduleController::class, 'destroy']);
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

// PaymentData
Route::middleware('auth:sanctum')->prefix('payment-data')->group(function () {
    Route::get('/', [PaymentDataController::class, 'index']);
    Route::get('/{id}', [PaymentDataController::class, 'show']);
    Route::post('/', [PaymentDataController::class, 'store']);
    Route::put('/{id}', [PaymentDataController::class, 'update']);
    Route::delete('/{id}', [PaymentDataController::class, 'destroy']);
});

// Payment
Route::middleware('auth:sanctum')->prefix('payment')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::get('/{id}', [PaymentController::class, 'show']);
    Route::post('/', [PaymentController::class, 'store']);
    Route::put('/{id}', [PaymentController::class, 'update']);
    Route::delete('/{id}', [PaymentController::class, 'destroy']);
});

// Receipt
Route::middleware('auth:sanctum')->prefix('receipt')->group(function () {
    Route::get('/', [ReceiptController::class, 'index']);
    Route::get('/{id}', [ReceiptController::class, 'show']);
    Route::post('/', [ReceiptController::class, 'store']);
    Route::put('/{id}', [ReceiptController::class, 'update']);
    Route::delete('/{id}', [ReceiptController::class, 'destroy']);
});

// Appointment
Route::middleware('auth:sanctum')->prefix('appointment')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']);
    Route::get('/{id}', [AppointmentController::class, 'show']);
    Route::post('/', [AppointmentController::class, 'store']);
    Route::put('/{id}', [AppointmentController::class, 'update']);
    Route::delete('/{id}', [AppointmentController::class, 'destroy']);
});

// AppointmentReport
Route::middleware('auth:sanctum')->prefix('appointment-report')->group(function () {
    Route::get('/', [AppointmentReportController::class, 'index']);
    Route::get('/{id}', [AppointmentReportController::class, 'show']);
    Route::post('/', [AppointmentReportController::class, 'store']);
    Route::put('/{id}', [AppointmentReportController::class, 'update']);
    Route::delete('/{id}', [AppointmentReportController::class, 'destroy']);
});


// Country
Route::middleware('auth:sanctum')->prefix('country')->group(function () {
    Route::get('/', [CountryController::class, 'index']);
    Route::get('/{id}', [CountryController::class, 'show']);
    Route::post('/', [CountryController::class, 'store']);
    Route::put('/{id}', [CountryController::class, 'update']);
    Route::delete('/{id}', [CountryController::class, 'destroy']);
});

// State
Route::middleware('auth:sanctum')->prefix('state')->group(function () {
    Route::get('/', [StateController::class, 'index']);
    Route::get('/{id}', [StateController::class, 'show']);
    Route::post('/', [StateController::class, 'store']);
    Route::put('/{id}', [StateController::class, 'update']);
    Route::delete('/{id}', [StateController::class, 'destroy']);
});

// City
Route::middleware('auth:sanctum')->prefix('city')->group(function () {
    Route::get('/', [CityController::class, 'index']);
    Route::get('/{id}', [CityController::class, 'show']);
    Route::post('/', [CityController::class, 'store']);
    Route::put('/{id}', [CityController::class, 'update']);
    Route::delete('/{id}', [CityController::class, 'destroy']);
});