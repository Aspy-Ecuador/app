<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index()
    {
        return State::with('country')->get();
    }

    public function show($id)
    {
        return State::with('country')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'country_id' => 'required|integer|exists:country,country_id',
        ]);

        return State::create($validated);
    }

    public function update(Request $request, $id)
    {
        $state = State::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
            'country_id' => 'integer|exists:country,country_id',
        ]);
        $state->update($validated);
        return $state;
    }

    public function destroy($id)
    {
        $state = State::findOrFail($id);
        $state->delete();
        return response()->noContent();
    }
}
