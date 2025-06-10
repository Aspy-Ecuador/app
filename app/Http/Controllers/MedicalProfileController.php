<?php

namespace App\Http\Controllers;

use App\Models\MedicalProfile;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MedicalProfileController extends Controller
{
    public function index()
    {
        return MedicalProfile::with('client')->get();
    }

    public function show($id)
    {
        return MedicalProfile::with('client')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_id' => 'required|integer|exists:client,person_id',
            'diagnose' => 'required|string|unique:medical_profile,diagnose',
            
        ]);

        return MedicalProfile::create($validated);
    }

    public function update(Request $request, $id)
    {
        $profile = MedicalProfile::findOrFail($id);
        $validated = $request->validate([
            'diagnose' => 'string|unique:medical_profile,diagnose,'.$id
        ]);
        
        $validated['modification_date'] = Carbon::now();
        $validated['modified_by'] = 'system';

        $profile->update($validated);
        return $profile;
    }

    public function destroy($id)
    {
        $profile = MedicalProfile::findOrFail($id);
        $profile->delete();
        return response()->noContent();
    }
}
