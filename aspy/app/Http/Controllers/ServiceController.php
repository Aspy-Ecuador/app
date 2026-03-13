<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of services
     */
    public function index()
    {
        $services = Service::all();

        return response()->json($services->map(function ($service) {
            return $this->formatService($service);
        }), 200);
    }

    /**
     * Store a newly created service
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:service,name',
            'price' => 'required|numeric|min:0',
        ]);

        $validated['created_by'] = auth()->user()->email ?? 'system';

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Servicio creado exitosamente',
            'service' => $this->formatService($service),
        ], 201);
    }

    /**
     * Display the specified service
     */
    public function show($id)
    {
        $service = Service::findOrFail($id);

        return response()->json($this->formatService($service), 200);
    }

    /**
     * Update the specified service
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|unique:service,name,' . $id . ',service_id',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $validated['modified_by'] = auth()->user()->email ?? 'system';
        $validated['modification_date'] = now();

        $service->update($validated);

        return response()->json([
            'message' => 'Servicio actualizado exitosamente',
            'service' => $this->formatService($service),
        ], 200);
    }

    /**
     * Remove the specified service
     */
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'message' => 'Servicio eliminado exitosamente',
        ], 200);
    }

    /**
     * Format service (only service data, no relationships)
     */
    private function formatService($service)
    {
        return [
            'service_id' => $service->service_id,
            'name' => $service->name,
            'price' => $service->price,
            'created_by' => $service->created_by,
        ];
    }
}