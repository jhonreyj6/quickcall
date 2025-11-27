<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'  => 'string|required',
            'email' => 'email:rfc,dns|required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages()->get('*'), 422);
        }

        $request->user()->update([
            'name'  => $request->input('name'),
            'email' => $request->input('email'),
            // 'phone_number' => $request->input('phone_number'),
        ]);

        return response()->json($request->user(), 200);
    }
}
