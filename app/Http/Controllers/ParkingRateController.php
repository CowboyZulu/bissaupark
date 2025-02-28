<?php

namespace App\Http\Controllers;

use App\Models\ParkingRate;
use App\Models\Zones;
use App\Models\VehicleCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParkingRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ParkingRate::with(['zone', 'vehicleCategory']);

        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('zone', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('vehicleCategory', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Apply rate type filter if provided
        if ($request->has('rate_type')) {
            $query->where('rate_type', $request->input('rate_type'));
        }

        // Apply status filter if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        // Apply weekend filter if provided
        if ($request->has('is_weekend_rate')) {
            $query->where('is_weekend_rate', $request->input('is_weekend_rate') === 'true');
        }

        // Apply holiday filter if provided
        if ($request->has('is_holiday_rate')) {
            $query->where('is_holiday_rate', $request->input('is_holiday_rate') === 'true');
        }

        return Inertia::render('ParkingRates/Index', [
            'parkingRates' => $query->paginate(10)->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ParkingRates/Create', [
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
            'rate_type' => ['required', 'in:hourly,daily,monthly'],
            'amount' => ['required', 'numeric', 'min:0'],
            'start_time' => ['nullable', 'required_if:rate_type,hourly', 'date_format:H:i'],
            'end_time' => ['nullable', 'required_if:rate_type,hourly', 'date_format:H:i', 'after:start_time'],
            'is_weekend_rate' => ['boolean'],
            'is_holiday_rate' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        ParkingRate::create($request->all());

        return redirect()->route('parking-rates.index')
            ->with('success', 'Parking rate created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ParkingRate $parkingRate)
    {
        return Inertia::render('ParkingRates/Show', [
            'parkingRate' => $parkingRate->load(['zone', 'vehicleCategory']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ParkingRate $parkingRate)
    {
        return Inertia::render('ParkingRates/Edit', [
            'parkingRate' => $parkingRate,
            'zones' => Zones::where('is_active', true)->get(),
            'vehicleCategories' => VehicleCategory::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ParkingRate $parkingRate)
    {
        $request->validate([
            'zone_id' => ['required', 'exists:zones,id'],
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'rate_type' => ['required', 'in:hourly,daily,monthly'],
            'amount' => ['required', 'numeric', 'min:0'],
            'start_time' => ['nullable', 'required_if:rate_type,hourly', 'date_format:H:i'],
            'end_time' => ['nullable', 'required_if:rate_type,hourly', 'date_format:H:i', 'after:start_time'],
            'is_weekend_rate' => ['boolean'],
            'is_holiday_rate' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $parkingRate->update($request->all());

        return redirect()->route('parking-rates.index')
            ->with('success', 'Parking rate updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ParkingRate $parkingRate)
    {
        $parkingRate->delete();
        return redirect()->route('parking-rates.index')
            ->with('success', 'Parking rate deleted successfully.');
    }
}
