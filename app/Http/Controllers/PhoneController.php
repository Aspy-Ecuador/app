<?php

namespace App\Http\Controllers;

use App\Models\Phone;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PhoneController extends Controller
{
    public function index()
    {
        return Phone::with('person')->get();
    }

    public function show($id)
    {
        return Phone::with('person')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|integer|exists:person,person_id',
            'type' => 'required|string',
            'number' => 'required|string',
            'name' => 'nullable|string',
            'relationship' => 'required|string',
            
        ]);

        return Phone::create($validated);
    }

    public function update(Request $request, $id)
    {
        $phone = Phone::findOrFail($id);
        $validated = $request->validate([
            'type' => 'string',
            'number' => 'string',
            'name' => 'string',
            'relationship' => 'string'
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

        $phone->update($validated);
        return $phone;
    }

    public function destroy($id)
    {
        $phone = Phone::findOrFail($id);
        $phone->delete();
        return response()->noContent();
    }
}
