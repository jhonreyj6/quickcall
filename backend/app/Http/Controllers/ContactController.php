<?php
namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Validator;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::where('user_id', auth()->id())->orderBy('name', 'asc')->paginate(12);

        return response()->json($contacts, 200);
    }

    public function favorite(Request $request)
    {
        $contacts = Contact::where([
            'user_id'  => auth()->id(),
            'favorite' => 1,
        ])->orderBy('name', 'asc')->paginate(12);

        return response()->json($contacts, 200);
    }

    public function search(Request $request)
    {
        $contacts = Contact::whereLike('name', '%' . $request->input('query') . '%')
            ->orWhereLike('phone_number', '%' . $request->input('query') . '%')
            ->where('user_id', auth()->id())
            ->orderBy('name', 'asc')
            ->paginate(12);

        return response()->json($contacts, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name.*'         => 'string|required',
            'phone_number.*' => 'string|required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages()->get('*'), 422);
        }

        foreach ($request->input('data') as $data) {
            $contacts = Contact::create([
                'user_id'      => auth()->id(),
                'name'         => $data->name,
                'phone_number' => $data->phone_number,
                'favorite'     => 0,
            ]);
        }

        return response()->json($contacts, 200);
    }

}
