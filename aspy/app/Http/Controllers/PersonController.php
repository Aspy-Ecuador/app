<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;

class PersonController extends Controller
{
    public function index()
    {
        $persons = Person::with([
            'gender',
            'occupation',
            'maritalStatus',
            'education',
            'userAccount.role',
            'phone',
            'address.city.state.country',            
            'identification',
        ])->get();
 
        return response()->json($persons);
    }

    public function show(int $id)
    {
        $person = Person::with([
            'gender',
            'occupation',
            'maritalStatus',
            'education',
            'userAccount',
            'phone',
            'address',
            'identification',
        ])->find($id);
 
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }
 
        return response()->json($person);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'           => 'nullable|integer|exists:user_account,user_account_id',
            'gender_id'         => 'nullable|integer|exists:gender,gender_id',
            'occupation_id'     => 'nullable|integer|exists:occupation,occupation_id',
            'marital_status_id' => 'nullable|integer|exists:marital_status,marital_status_id',
            'education_id'      => 'nullable|integer|exists:education,education_id',
            'first_name'        => 'required|string|max:100',
            'last_name'         => 'required|string|max:100',
            'birthdate'         => 'nullable|date',
            'created_by'        => 'nullable|integer',
        ]);
 
        $validated['created_by'] = 1;

        $person = Person::create($validated);
 
        return response()->json($person->load([
            'gender',
            'occupation',
            'maritalStatus',
            'education',
            'userAccount',
        ]), 201);
    }

    public function update(Request $request, $id)
    {
        $person = Person::find($id);
 
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }
 
        $validated = $request->validate([
            'user_id'           => 'nullable|integer|exists:user_account,user_account_id',
            'gender_id'         => 'nullable|integer|exists:gender,gender_id',
            'occupation_id'     => 'nullable|integer|exists:occupation,occupation_id',
            'marital_status_id' => 'nullable|integer|exists:marital_status,marital_status_id',
            'education_id'      => 'nullable|integer|exists:education,education_id',
            'first_name'        => 'sometimes|required|string|max:100',
            'last_name'         => 'sometimes|required|string|max:100',
            'birthdate'         => 'nullable|date',
            'modified_by'       => 'nullable|integer',
        ]);
 
        $validated['modified_by'] = 1;

        $person->update($validated);
 
        return response()->json($person->load([
            'gender',
            'occupation',
            'maritalStatus',
            'education',
            'userAccount',
        ]));
    }

    public function destroy($id)
    {
        $person = Person::find($id);
 
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }
 
        $person->delete();
 
        return response()->json(['message' => 'Person deleted successfully']);
    }
}
