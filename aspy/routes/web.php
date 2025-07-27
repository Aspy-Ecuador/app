<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// /test que devuelve un json quemado
Route::get('/test', function () {
    return response()->json(['message' => 'Hello, Test!']);
});