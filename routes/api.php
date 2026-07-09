<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// /api/send-engaz
Route::post('/send-engaz', [ApiController::class, 'sendEngaz']);
Route::post('/token/check-medical', [ApiController::class, 'checkMedical']);
