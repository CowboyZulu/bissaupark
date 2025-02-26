<?php

namespace App\Http\Controllers;

use App\Models\VehicleCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('VehicleCategories/Index', [
            'categories' => VehicleCategory::paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('VehicleCategories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:vehicle_categories'],
            'description' => ['nullable', 'string'],
        ]);

        VehicleCategory::create($request->all());

        return redirect()->route('vehicle-categories.index')
            ->with('success', 'Vehicle category created successfully.');
    }

    public function edit(VehicleCategory $vehicleCategory)
    {
        return Inertia::render('VehicleCategories/Edit', [
            'category' => $vehicleCategory,
        ]);
    }

    public function update(Request $request, VehicleCategory $vehicleCategory)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:vehicle_categories,name,' . $vehicleCategory->id],
            'description' => ['nullable', 'string'],
        ]);

        $vehicleCategory->update($request->all());

        return redirect()->route('vehicle-categories.index')
            ->with('success', 'Vehicle category updated successfully.');
    }

    public function destroy(VehicleCategory $vehicleCategory)
    {
        // Check if the category is being used by any vehicles
        if ($vehicleCategory->vehicles()->exists()) {
            return redirect()->route('vehicle-categories.index')
                ->with('error', 'Cannot delete category because it is being used by vehicles.');
        }

        $vehicleCategory->delete();
        return redirect()->route('vehicle-categories.index')
            ->with('success', 'Vehicle category deleted successfully.');
    }
} 