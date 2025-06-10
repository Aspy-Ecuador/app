<?php

namespace App\Http\Controllers;

use App\Models\Aga;
use Illuminate\Http\Request;

class AgaController extends Controller
{
    public function index()
    {
        return Aga::all();
    }

    public function show($id)
    {
        return Aga::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        return Aga::create($validated);
    }

    public function update(Request $request, $id)
    {
        $aga = Aga::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
        ]);
        $aga->update($validated);
        return $aga;
    }

    public function destroy($id)
    {
        $aga = Aga::findOrFail($id);
        $aga->delete();
        return response()->noContent();
    }
}
