<?php

namespace App\Http\Controllers;

use App\Models\FineRate;
use App\Models\Zones;
use App\Models\VehicleCategory;
use App\Models\ViolationType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FineRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FineRate::with(['zone', 'vehicleCategory', 'violationType']);

        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('zone', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('vehicleCategory', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('violationType', function ($q) use ($search) {
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

        // Apply violation type filter if provided
        if ($request->has('violation_type_id')) {
            $query->where('violation_type_id', $request->input('violation_type_id'));
        }

        // Apply status filter if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        return Inertia::render('FineRates/Index', [
            'fineRates' => $query->paginate(10)->withQueryString(),
            'zones' => Zones::all(),
            'vehicleCategories' => VehicleCategory::all(),
            'violationTypes' => ViolationType::all(),
            'filters' => $request->only(['search', 'zone_id', 'vehicle_category_id', 'violation_type_id', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('FineRates/Create', [
            'zones' => Zones::where('is_active', true)->get(),
            'vehicleCategories' => VehicleCategory::all(),
            'violationTypes' => ViolationType::where('is_active', true)->get(),
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
            'violation_type_id' => ['required', 'exists:violation_types,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        FineRate::create($request->all());

        return redirect()->route('fine-rates.index')
            ->with('success', 'Fine rate created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FineRate $fineRate)
    {
        return Inertia::render('FineRates/Show', [
            'fineRate' => $fineRate->load(['zone', 'vehicleCategory', 'violationType']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FineRate $fineRate)
    {
        return Inertia::render('FineRates/Edit', [
            'fineRate' => $fineRate,
            'zones' => Zones::where('is_active', true)->get(),
            'vehicleCategories' => VehicleCategory::all(),
            'violationTypes' => ViolationType::where('is_active', true)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FineRate $fineRate)
    {
        $request->validate([
            'zone_id' => ['required', 'exists:zones,id'],
            'vehicle_category_id' => ['required', 'exists:vehicle_categories,id'],
            'violation_type_id' => ['required', 'exists:violation_types,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $fineRate->update($request->all());

        return redirect()->route('fine-rates.index')
            ->with('success', 'Fine rate updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FineRate $fineRate)
    {
        $fineRate->delete();
        return redirect()->route('fine-rates.index')
            ->with('success', 'Fine rate deleted successfully.');
    }
}
