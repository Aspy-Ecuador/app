<?php

namespace App\Http\Controllers;

use App\Models\Occupation;
use Illuminate\Http\Request;

class OccupationController extends Controller
{
    public function index()
    {
        return Occupation::all();
    }

    public function show($id)
    {
        return Occupation::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        return Occupation::create($validated);
    }

    public function update(Request $request, $id)
    {
        $occupation = Occupation::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
        ]);
        $occupation->update($validated);
        return $occupation;
    }

    public function destroy($id)
    {
        $occupation = Occupation::findOrFail($id);
        $occupation->delete();
        return response()->noContent();
    }
}
