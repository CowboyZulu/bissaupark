<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehicleCategory;
use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        return Inertia::render('Vehicles/Index', [
            'vehicles' => Vehicle::with(['category', 'driver'])->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Vehicles/Create', [
            'categories' => VehicleCategory::all(),
            'drivers' => Driver::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'plate_number' => ['required', 'string', 'max:255', 'unique:vehicles'],
            'category_id' => ['required', 'exists:vehicle_categories,id'],
            'model' => ['required', 'string', 'max:255'],
            'make' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
            'driver_id' => ['nullable', 'exists:drivers,id'],
        ]);

        Vehicle::create($request->all());

        return redirect()->route('vehicles.index')
            ->with('success', 'Vehicle created successfully.');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('Vehicles/Edit', [
            'vehicle' => $vehicle->load(['category', 'driver']),
            'categories' => VehicleCategory::all(),
            'drivers' => Driver::all(),
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $request->validate([
            'plate_number' => ['required', 'string', 'max:255', 'unique:vehicles,plate_number,' . $vehicle->id],
            'category_id' => ['required', 'exists:vehicle_categories,id'],
            'model' => ['required', 'string', 'max:255'],
            'make' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
            'driver_id' => ['nullable', 'exists:drivers,id'],
        ]);

        $vehicle->update($request->all());

        return redirect()->route('vehicles.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return redirect()->route('vehicles.index')
            ->with('success', 'Vehicle deleted successfully.');
    }
} 