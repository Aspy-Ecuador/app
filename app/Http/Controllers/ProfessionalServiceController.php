<?php

namespace App\Http\Controllers;

use App\Models\ProfessionalService;
use Illuminate\Http\Request;

class ProfessionalServiceController extends Controller
{
    public function index()
    {
        $services = ProfessionalService::all();
        return response()->json($services);
    }

    public function show($id)
    {
        $service = ProfessionalService::find($id);
        if (!$service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }
        return response()->json($service);
    }

    public function store(Request $request)
    {
        $service = ProfessionalService::create($request->all());
        return response()->json($service, 201);
    }

    public function update(Request $request, $id)
    {
        $service = ProfessionalService::find($id);
        if (!$service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }
        $service->update($request->all());
        return response()->json($service);
    }

    public function destroy($id)
    {
        $service = ProfessionalService::find($id);
        if (!$service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }
        $service->delete();
        return response()->json(['message' => 'Servicio eliminado']);
    }
}
