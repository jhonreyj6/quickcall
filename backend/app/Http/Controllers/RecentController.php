<?php
namespace App\Http\Controllers;

use App\Models\Recent;
use Illuminate\Http\Request;

class RecentController extends Controller
{
    public function index(Request $request)
    {
        $recent = Recent::where('user_id', auth()->id())->orderBy('called_at', 'desc')->paginate(12);
        return response()->json($recent, 200);
    }

}
