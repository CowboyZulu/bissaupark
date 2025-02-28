<?php

namespace App\Http\Controllers;

use App\Models\ViolationType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViolationTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ViolationType::query();
        
        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
        }
        
        // Apply status filter if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }
        
        return Inertia::render('ViolationTypes/Index', [
            'violationTypes' => $query->paginate(10)->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ViolationTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => 'required|string|min:2|max:255|unique:violation_types,code',
            'is_active' => 'boolean',
        ]);

        $violationType = ViolationType::create($validated);

        return redirect()->route('violation-types.index')
            ->with('success', 'Violation type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ViolationType $violationType)
    {
        return Inertia::render('ViolationTypes/Show', [
            'violationType' => $violationType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ViolationType $violationType)
    {
        return Inertia::render('ViolationTypes/Edit', [
            'violationType' => $violationType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ViolationType $violationType)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => 'required|string|min:2|max:255|unique:violation_types,code,' . $violationType->id,
            'is_active' => 'boolean',
        ]);

        $violationType->update($validated);

        return redirect()->route('violation-types.index')
            ->with('success', 'Violation type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ViolationType $violationType)
    {
        $violationType->delete();

        return redirect()->route('violation-types.index')
            ->with('success', 'Violation type deleted successfully.');
    }
}
