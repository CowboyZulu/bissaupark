<?php

namespace App\Http\Controllers;

use App\Models\ParkingSpace;
use App\Models\Street;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ParkingSpaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ParkingSpaces/Index', [
            'parkingSpaces' => ParkingSpace::with('street')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ParkingSpaces/Create', [
            'streets' => Street::where('is_active', true)->get(),
            'googleMapsApiKey' => config('services.google.maps_api_key'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'street_id' => ['required', 'exists:streets,id'],
            'type' => ['required', 'in:parallel,perpendicular,angled'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'is_handicap' => ['boolean'],
            'is_loading_zone' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        // Generate space number based on street
        $street = Street::findOrFail($request->street_id);
        $existingCount = ParkingSpace::where('street_id', $street->id)->count();
        $spaceNumber = $street->code . '-' . str_pad(($existingCount + 1), 3, '0', STR_PAD_LEFT);

        ParkingSpace::create([
            'street_id' => $request->street_id,
            'space_number' => $spaceNumber,
            'type' => $request->type,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_handicap' => $request->is_handicap ?? false,
            'is_loading_zone' => $request->is_loading_zone ?? false,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('parking-spaces.index')
            ->with('success', 'Parking space created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ParkingSpace $parkingSpace)
    {
        return Inertia::render('ParkingSpaces/Show', [
            'parkingSpace' => $parkingSpace->load('street'),
            'googleMapsApiKey' => config('services.google.maps_api_key'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ParkingSpace $parkingSpace)
    {
        return Inertia::render('ParkingSpaces/Edit', [
            'parkingSpace' => $parkingSpace->load('street'),
            'streets' => Street::where('is_active', true)->get(),
            'googleMapsApiKey' => config('services.google.maps_api_key'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ParkingSpace $parkingSpace)
    {
        $request->validate([
            'street_id' => ['required', 'exists:streets,id'],
            'type' => ['required', 'in:parallel,perpendicular,angled'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'is_handicap' => ['boolean'],
            'is_loading_zone' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        // If street changed, update space number
        if ($parkingSpace->street_id != $request->street_id) {
            $street = Street::findOrFail($request->street_id);
            $existingCount = ParkingSpace::where('street_id', $street->id)->count();
            $spaceNumber = $street->code . '-' . str_pad(($existingCount + 1), 3, '0', STR_PAD_LEFT);
            $parkingSpace->space_number = $spaceNumber;
        }

        $parkingSpace->update([
            'street_id' => $request->street_id,
            'type' => $request->type,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_handicap' => $request->is_handicap ?? false,
            'is_loading_zone' => $request->is_loading_zone ?? false,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('parking-spaces.index')
            ->with('success', 'Parking space updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ParkingSpace $parkingSpace)
    {
        $parkingSpace->delete();
        return redirect()->route('parking-spaces.index')
            ->with('success', 'Parking space deleted successfully.');
    }
}
