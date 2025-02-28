<?php

namespace App\Http\Controllers;

use App\Models\ClampingRate;
use App\Models\VehicleCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClampingRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ClampingRate::with(['vehicleCategory']);

        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('vehicleCategory', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Apply status filter if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        return Inertia::render('ClampingRates/Index', [
            'clampingRates' => $query->paginate(10)->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ClampingRates/Create', [
            'vehicleCategories' => VehicleCategory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        ClampingRate::create($request->all());

        return redirect()->route('clamping-rates.index')
            ->with('success', 'Clamping rate created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ClampingRate $clampingRate)
    {
        return Inertia::render('ClampingRates/Show', [
            'clampingRate' => $clampingRate->load(['vehicleCategory']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClampingRate $clampingRate)
    {
        return Inertia::render('ClampingRates/Edit', [
            'clampingRate' => $clampingRate,
            'vehicleCategories' => VehicleCategory::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClampingRate $clampingRate)
    {
        $request->validate([
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $clampingRate->update($request->all());

        return redirect()->route('clamping-rates.index')
            ->with('success', 'Clamping rate updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClampingRate $clampingRate)
    {
        $clampingRate->delete();
        return redirect()->route('clamping-rates.index')
            ->with('success', 'Clamping rate deleted successfully.');
    }
}
