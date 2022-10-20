<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Group\GroupController;
use App\Http\Controllers\ShoppingList\ShoppingListController;
use App\Http\Controllers\ShoppingList\ShoppingListItemController;
use Illuminate\Support\Facades\Route;


Route::post('/auth/register', [AuthController::class, 'register'])->name('register');
Route::post('/auth/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {

    Route::get('lists', [ShoppingListController::class, 'index']);
    Route::get('lists/{shoppingList}', [ShoppingListController::class, 'show']);
    Route::post('lists', [ShoppingListController::class, 'store']);
    Route::post('lists/{shoppingList}', [ShoppingListController::class, 'update']);
    Route::delete('lists/{shoppingList}', [ShoppingListController::class, 'destroy']);

    Route::post('lists/{shoppingList}/item', [ShoppingListItemController::class, 'store']);
    Route::post('lists/{shoppingList}/item/{shoppingListItem}', [ShoppingListItemController::class, 'update'])->scopeBindings();
    Route::delete('lists/{shoppingList}/item/{shoppingListItem}', [ShoppingListItemController::class, 'destroy'])->scopeBindings();

    Route::get('listsItemUnit', [ShoppingListItemController::class, 'unit']);

    Route::post('group/{group}', [GroupController::class, 'update']);
    Route::delete('group', [GroupController::class, 'destroy']);

    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
