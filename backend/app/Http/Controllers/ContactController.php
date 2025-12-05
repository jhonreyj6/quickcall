<?php
namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Validator;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::where(['user_id' => auth()->id(), 'favorite' => 0])->orderBy('name', 'asc')->paginate(12);

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
        $condition = [];
        if (count($request->input('data'))) {
            $condition = [
                'data.*.name'                  => 'string|required',
                'data.*.phoneNumbers.*.number' => 'string|required',
            ];
        } else {
            $condition = [
                'name.*'         => 'string|required',
                'phone_number.*' => 'string|required',
            ];
        }

        $validator = Validator::make($request->all(), $condition);

        if ($validator->fails()) {
            return response()->json($validator->messages()->get('*'), 422);
        }

        foreach ($request->input('data') as $data) {
            foreach ($data['phoneNumbers'] as $index => $number) {
                $exist = Contact::where('name', $data['name'])->orWhere('name', $data['name'] . "_" . $index)->first();

                if (! $exist) {
                    Contact::create([
                        'user_id'      => auth()->id(),
                        'name'         => $index > 0 ? $data['name'] . "_" . $index : $data['name'],
                        'phone_number' => $data['phoneNumbers'][$index]['number'],
                        'favorite'     => 0,
                    ]);
                }
            }
        }

        return response()->json("success", 200);
    }
}
