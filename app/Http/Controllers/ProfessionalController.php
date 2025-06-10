<?php

namespace App\Http\Controllers;

use App\Models\Professional;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProfessionalController extends Controller
{
    public function index()
    {
        return Professional::with('person')->get();
    }

    public function show($id)
    {
        return Professional::with('person')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|integer|unique:professionals,person_id',
            'specialty' => 'required|string',
            'title' => 'required|string',
            'about' => 'nullable|string',
            
        ]);

        return Professional::create($validated);
    }

    public function update(Request $request, $id)
    {
        $professional = Professional::findOrFail($id);
        $validated = $request->validate([
            'specialty' => 'string',
            'title' => 'string',
            'about' => 'nullable|string'
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

        $professional->update($validated);
        return $professional;
    }

    public function destroy($id)
    {
        $professional = Professional::findOrFail($id);
        $professional->delete();
        return response()->noContent();
    }
}
