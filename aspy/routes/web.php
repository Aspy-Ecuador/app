<?php

use Illuminate\Support\Facades\Route;

// Este servidor solo ofrece el API (rutas en routes/api.php, bajo /api). La web del sistema vive en
// otro sitio; aquí no hay páginas, sesiones de navegador ni cookies (ver bootstrap/app.php).
Route::get('/', fn () => response()->json(['servicio' => 'API de la Fundación ASPY', 'estado' => 'ok']));
