<?php

namespace App\Http\Controllers;

use App\Models\UserAccountStatus;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UserAccountStatusController extends Controller
{
    public function index()
    {
        return UserAccountStatus::all();
    }

    public function store(Request $request)
    {
        $status = UserAccountStatus::create($request->all());
        return response()->json($status, 201);
    }

    public function show($id)
    {
        return UserAccountStatus::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $status = UserAccountStatus::findOrFail($id);
        $status->update($request->all());
        return response()->json($status, 200);
    }

    public function destroy($id)
    {
        UserAccountStatus::destroy($id);
        return response()->json(null, 204);
    }
}
