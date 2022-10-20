<?php

use Illuminate\Support\Facades\Route;

Route::any('{any}', function(){
    return response()->json(['message' => 'Request could not be processed'], 400);
})->where('any', '.*');
