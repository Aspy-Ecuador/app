<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AddressController extends Controller
{
    public function index()
    {
        return Address::all();
    }

    public function store(Request $request)
    {
        $address = Address::create($request->all());
        return response()->json($address, 201);
    }

    public function show($id)
    {
        return Address::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $address = Address::findOrFail($id);
        $address->update($request->all());
        return response()->json($address, 200);
    }

    public function destroy($id)
    {
        Address::destroy($id);
        return response()->json(null, 204);
    }
}
