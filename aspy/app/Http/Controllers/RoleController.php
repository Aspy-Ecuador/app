<?php
// FINAL
namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function show(int $id): JsonResponse
    {
        $role = Role::find($id);
 
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
 
        return response()->json($role);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',

        ]);

        $validated['created_by'] = 1;

        $role = Role::create($validated);
 
        return response()->json($role, 201);
    }

    public function update(Request $request, int $id)
    {
        $role = Role::find($id);
 
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
 
        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:100',
        ]);
 
        $validated['modified_by'] = 1;

        $role->update($validated);

        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::find($id);
 
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
 
        $role->delete();
 
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
