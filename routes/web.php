<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\VehicleCategoryController;
use App\Http\Controllers\ViolationTypeController;
use App\Http\Controllers\ZonesController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Management Routes
    Route::resource('users', UserController::class);
    
    // Role Management Routes
    Route::resource('roles', RoleController::class);
    
    // Permission Management Routes
    Route::resource('permissions', PermissionController::class);
    
    // Vehicle Management Routes
    Route::resource('vehicles', VehicleController::class);
    
    // Driver Management Routes
    Route::resource('drivers', DriverController::class);
    
    // Vehicle Category Management Routes
    Route::resource('vehicle-categories', VehicleCategoryController::class);
    
    // Violation Type Management Routes
    Route::resource('violation-types', ViolationTypeController::class);
    
    // Zones Management Routes
    Route::resource('zones', ZonesController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
