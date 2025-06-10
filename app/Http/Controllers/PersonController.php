<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PersonController extends Controller
{
    public function index()
    {
        return Person::all();
    }

    public function show($id)
    {
        return Person::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|unique:people,user_id',
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'birthdate' => 'required|date|before_or_equal:today',
            'gender' => 'required|integer',
            'occupation' => 'required|integer',
            'marital_status' => 'required|integer',
            'education' => 'required|integer',
            
        ]);

        return Person::create($validated);
    }

    public function update(Request $request, $id)
    {
        $person = Person::findOrFail($id);
        $validated = $request->validate([
            'first_name' => 'string',
            'middle_name' => 'nullable|string',
            'birthdate' => 'date|before_or_equal:today',
            'gender' => 'integer',
            'occupation' => 'integer',
            'marital_status' => 'integer',
            'education' => 'integer'
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

        $person->update($validated);
        return $person;
    }

    public function destroy($id)
    {
        $person = Person::findOrFail($id);
        $person->delete();
        return response()->noContent();
    }
}
