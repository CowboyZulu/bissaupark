<?php

namespace App\Http\Controllers;

use App\Models\Zones;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZonesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $zones = Zones::all();
        
        return Inertia::render('Zones/Index', [
            'zones' => $zones,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Zones/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => 'required|string|min:2|max:255|unique:zones,code',
            'is_active' => 'boolean',
        ]);

        $zone = Zones::create($validated);

        return redirect()->route('zones.index')
            ->with('success', 'Zone created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Zones $zone)
    {
        return Inertia::render('Zones/Show', [
            'zone' => $zone,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Zones $zone)
    {
        return Inertia::render('Zones/Edit', [
            'zone' => $zone,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Zones $zone)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => 'required|string|min:2|max:255|unique:zones,code,' . $zone->id,
            'is_active' => 'boolean',
        ]);

        $zone->update($validated);

        return redirect()->route('zones.index')
            ->with('success', 'Zone updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Zones $zone)
    {
        $zone->delete();

        return redirect()->route('zones.index')
            ->with('success', 'Zone deleted successfully.');
    }
}
