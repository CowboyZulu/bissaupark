<?php

namespace App\Http\Controllers;

use App\Models\TowingRate;
use App\Models\Zones;
use App\Models\VehicleCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TowingRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = TowingRate::with(['zone', 'vehicleCategory']);

        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('zone', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('vehicleCategory', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Apply zone filter if provided
        if ($request->has('zone_id')) {
            $query->where('zone_id', $request->input('zone_id'));
        }

        // Apply vehicle category filter if provided
        if ($request->has('vehicle_category_id')) {
            $query->where('vehicle_category_id', $request->input('vehicle_category_id'));
        }

        // Apply status filter if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        return Inertia::render('TowingRates/Index', [
            'towingRates' => $query->paginate(10)->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('TowingRates/Create', [
            'zones' => Zones::where('is_active', true)->get(),
            'vehicleCategories' => VehicleCategory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'zone_id' => ['required', 'exists:zones,id'],
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'service_fee' => ['required', 'numeric', 'min:0'],
            'fine_amount' => ['required', 'numeric', 'min:0'],
            'daily_storage_fee' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        TowingRate::create($request->all());

        return redirect()->route('towing-rates.index')
            ->with('success', 'Towing rate created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TowingRate $towingRate)
    {
        return Inertia::render('TowingRates/Show', [
            'towingRate' => $towingRate->load(['zone', 'vehicleCategory']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TowingRate $towingRate)
    {
        return Inertia::render('TowingRates/Edit', [
            'towingRate' => $towingRate,
            'zones' => Zones::where('is_active', true)->get(),
            'vehicleCategories' => VehicleCategory::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TowingRate $towingRate)
    {
        $request->validate([
            'zone_id' => ['required', 'exists:zones,id'],
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'service_fee' => ['required', 'numeric', 'min:0'],
            'fine_amount' => ['required', 'numeric', 'min:0'],
            'daily_storage_fee' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $towingRate->update($request->all());

        return redirect()->route('towing-rates.index')
            ->with('success', 'Towing rate updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TowingRate $towingRate)
    {
        $towingRate->delete();
        return redirect()->route('towing-rates.index')
            ->with('success', 'Towing rate deleted successfully.');
    }
}
