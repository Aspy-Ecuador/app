<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StaffController extends Controller
{
    public function index()
    {
        $staffs = Staff::all();
        return response()->json($staffs);
    }

    public function show($id)
    {
        $staff = Staff::find($id);
        if (!$staff) {
            return response()->json(['message' => 'Staff no encontrado'], 404);
        }
        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $staff = Staff::create($request->all());
        return response()->json($staff, 201);
    }

    public function update(Request $request, $id)
    {
        $staff = Staff::find($id);
        if (!$staff) {
            return response()->json(['message' => 'Staff no encontrado'], 404);
        }
        $staff->update($request->all());
        return response()->json($staff);
    }

    public function destroy($id)
    {
        $staff = Staff::find($id);
        if (!$staff) {
            return response()->json(['message' => 'Staff no encontrado'], 404);
        }
        $staff->delete();
        return response()->json(['message' => 'Staff eliminado']);
    }
}
