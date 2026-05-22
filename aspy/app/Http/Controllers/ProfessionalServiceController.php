<?php

namespace App\Http\Controllers;

use App\Models\ProfessionalService;
use Illuminate\Http\Request;

class ProfessionalServiceController extends Controller
{
    public function index()
    {
        $services = ProfessionalService::with(['service', 'professional'])->get();

        return response()->json($services);
    }

    public function show($id)
    {
        $service = ProfessionalService::find($id);
        if (! $service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        return response()->json($service);
    }

    public function store(Request $request)
    {
        $service = ProfessionalService::create([
            'service_id'      => $request->service_id,
            'professional_id' => $request->professional_id,
            'created_by'      =>  auth()->id(),
            'modified_by'     => null,
        ]);

        return response()->json($service, 201);
    }

    public function update(Request $request, $id)
    {
        $service = ProfessionalService::find($id);
        if (!$service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        $service->update([
            'professional_id' => $request->professional_id,
            'modified_by'     =>  auth()->id(),
        ]);

        return response()->json($service);
    }

    public function destroy($id)
    {
        $service = ProfessionalService::find($id);
        if (! $service) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }
        $service->delete();

        return response()->json(['message' => 'Servicio eliminado']);
    }
}