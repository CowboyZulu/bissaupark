<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverController extends Controller
{
    public function index()
    {
        return Inertia::render('Drivers/Index', [
            'drivers' => Driver::paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Drivers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'license_number' => ['required', 'string', 'max:255', 'unique:drivers'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'license_expiry' => ['required', 'date'],
        ]);

        $driver = Driver::create($request->all());

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'driver' => $driver,
            ]);
        }

        return redirect()->route('drivers.index')
            ->with('success', 'Driver created successfully.');
    }

    public function edit(Driver $driver)
    {
        return Inertia::render('Drivers/Edit', [
            'driver' => $driver,
        ]);
    }

    public function update(Request $request, Driver $driver)
    {
        $request->validate([
            'license_number' => ['required', 'string', 'max:255', 'unique:drivers,license_number,' . $driver->id],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'license_expiry' => ['required', 'date'],
        ]);

        $driver->update($request->all());

        return redirect()->route('drivers.index')
            ->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver)
    {
        // Check if the driver is assigned to any vehicles
        if ($driver->vehicles()->exists()) {
            return redirect()->route('drivers.index')
                ->with('error', 'Cannot delete driver because they are assigned to vehicles.');
        }

        $driver->delete();
        return redirect()->route('drivers.index')
            ->with('success', 'Driver deleted successfully.');
    }
} 