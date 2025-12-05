<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Validator;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('auth:api', ['except' => ['login', 'register']]);
    // }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function register(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'name'             => 'required|min:2',
            'email'            => 'required|email|unique:users',
            'password'         => 'required|min:8',
            'confirm_password' => 'same:password',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages()->get('*'), 400);
        }

        $maxAttempts = 2;
        $ip          = $request->ip();
        $cacheKey    = 'registration_attempts_' . $ip;
        $attempts    = Cache::get($cacheKey, 0);

        if ($attempts >= $maxAttempts) {

            return response()->json([
                'message' => 'You have reached the maximum number of registrations for today.',
            ], 429); // HTTP 429 Too Many Requests
        }

        // Increment attempt count and set expiration to the end of the day
        $expiresAt = now()->endOfDay();
        Cache::put($cacheKey, $attempts + 1, $expiresAt);

        User::create([
            'name'     => $request->input('name'),
            'email'    => $request->input('email'),
            'password' => $request->input('password'),
        ]);

        // Mail::to($user->email)->send(new UserRegister($user));

        return $this->login($request);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'user'         => auth()->user(),
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60,
        ]);
    }
}
