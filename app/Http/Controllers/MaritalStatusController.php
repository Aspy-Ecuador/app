<?php

namespace App\Http\Controllers;

use App\Models\MaritalStatus;
use Illuminate\Http\Request;

class MaritalStatusController extends Controller
{
    public function index()
    {
        return MaritalStatus::all();
    }

    public function show($id)
    {
        return MaritalStatus::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        return MaritalStatus::create($validated);
    }

    public function update(Request $request, $id)
    {
        $maritalStatus = MaritalStatus::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
        ]);
        $maritalStatus->update($validated);
        return $maritalStatus;
    }

    public function destroy($id)
    {
        $maritalStatus = MaritalStatus::findOrFail($id);
        $maritalStatus->delete();
        return response()->noContent();
    }
}
