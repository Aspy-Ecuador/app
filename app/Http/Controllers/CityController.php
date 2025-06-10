<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        return City::with('state')->get();
    }

    public function show($id)
    {
        return City::with('state')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'state_id' => 'required|integer|exists:state,state_id',
        ]);

        return City::create($validated);
    }

    public function update(Request $request, $id)
    {
        $city = City::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
            'state_id' => 'integer|exists:state,state_id',
        ]);
        $city->update($validated);
        return $city;
    }

    public function destroy($id)
    {
        $city = City::findOrFail($id);
        $city->delete();
        return response()->noContent();
    }
}
