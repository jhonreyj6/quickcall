<?php
namespace App\Http\Controllers;

use App\Models\Recent;

class RecentController extends Controller
{
    public function index()
    {
        // return response()->json(['error' => 'somethign went wrong'], 500);
        $recent = Recent::where('user_id', auth()->id())->orderBy('called_at', 'desc')->paginate(12);
        return response()->json($recent, 200);
    }

}
