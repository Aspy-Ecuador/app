<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    public function index()
    {
        return Gender::all();
    }

    public function show($id)
    {
        return Gender::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        return Gender::create($validated);
    }

    public function update(Request $request, $id)
    {
        $gender = Gender::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
        ]);
        $gender->update($validated);
        return $gender;
    }

    public function destroy($id)
    {
        $gender = Gender::findOrFail($id);
        $gender->delete();
        return response()->noContent();
    }
}
