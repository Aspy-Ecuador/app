<?php
// FINAL
namespace App\Http\Controllers;

use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
    }

    public function show(int $id)
    {
        $service = Service::find($id);
 
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }
 
        return response()->json($service);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:150',
            'price'      => 'required|numeric|min:0',            
        ]);
 
        $validated['created_by'] = 1;

        $service = Service::create($validated);
 
        return response()->json($service, 201);
    }

    public function update(Request $request, int $id)
    {
        $service = Service::find($id);
 
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }
 
        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:150',
            'price'       => 'sometimes|required|numeric|min:0',
        ]);
 
        $validated['modified_by'] = 1;

        $service->update($validated);
 
        return response()->json($service);
    }

    public function destroy($id)
    {
        $service = Service::find($id);
 
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }
 
        $service->delete();
 
        return response()->json(['message' => 'Service deleted successfully']);
    }
}
