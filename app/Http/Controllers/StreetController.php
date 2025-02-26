<?php

namespace App\Http\Controllers;

use App\Models\Street;
use App\Models\Zones;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StreetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $streets = Street::with('zone')->get();
        
        return Inertia::render('Streets/Index', [
            'streets' => $streets,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $zones = Zones::where('is_active', true)->get();
        
        return Inertia::render('Streets/Create', [
            'zones' => $zones,
            'googleMapsApiKey' => env('GOOGLE_MAPS_API_KEY', 'AIzaSyBUwqEWoqpgNuOdKdPrl6J8h50-2j6_38s'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:main,cross',
            'name' => 'required|string|min:2|max:255',
            'zone_id' => 'nullable|exists:zones,id',
            'is_active' => 'boolean',
            'start_latitude' => 'nullable|numeric',
            'end_latitude' => 'nullable|numeric',
            'start_longitude' => 'nullable|numeric',
            'end_longitude' => 'nullable|numeric',
            'path_coordinates' => 'nullable|array',
        ]);

        // Generate code based on street name and type
        $code = Str::upper(Str::substr($validated['type'], 0, 1) . '-' . Str::slug($validated['name']));
        $validated['code'] = $code;

        $street = Street::create($validated);

        return redirect()->route('streets.index')
            ->with('success', 'Street created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Street $street)
    {
        return Inertia::render('Streets/Show', [
            'street' => $street->load('zone'),
            'googleMapsApiKey' => env('GOOGLE_MAPS_API_KEY', 'AIzaSyBUwqEWoqpgNuOdKdPrl6J8h50-2j6_38s'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Street $street)
    {
        $zones = Zones::where('is_active', true)->get();
        
        return Inertia::render('Streets/Edit', [
            'street' => $street->load('zone'),
            'zones' => $zones,
            'googleMapsApiKey' => env('GOOGLE_MAPS_API_KEY', 'AIzaSyBUwqEWoqpgNuOdKdPrl6J8h50-2j6_38s'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Street $street)
    {
        $validated = $request->validate([
            'type' => 'required|in:main,cross',
            'name' => 'required|string|min:2|max:255',
            'zone_id' => 'nullable|exists:zones,id',
            'is_active' => 'boolean',
            'start_latitude' => 'nullable|numeric',
            'end_latitude' => 'nullable|numeric',
            'start_longitude' => 'nullable|numeric',
            'end_longitude' => 'nullable|numeric',
            'path_coordinates' => 'nullable|array',
        ]);

        // Only regenerate code if name or type has changed
        if ($street->name !== $validated['name'] || $street->type !== $validated['type']) {
            $code = Str::upper(Str::substr($validated['type'], 0, 1) . '-' . Str::slug($validated['name']));
            $validated['code'] = $code;
        }

        $street->update($validated);

        return redirect()->route('streets.index')
            ->with('success', 'Street updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Street $street)
    {
        $street->delete();

        return redirect()->route('streets.index')
            ->with('success', 'Street deleted successfully.');
    }
}
