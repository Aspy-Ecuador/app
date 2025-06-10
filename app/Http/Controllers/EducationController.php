<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index()
    {
        return Education::all();
    }

    public function show($id)
    {
        return Education::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        return Education::create($validated);
    }

    public function update(Request $request, $id)
    {
        $education = Education::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
        ]);
        $education->update($validated);
        return $education;
    }

    public function destroy($id)
    {
        $education = Education::findOrFail($id);
        $education->delete();
        return response()->noContent();
    }
}
