<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;

class ThrottleRegistration
{
    /**
     * Maximum registration attempts per IP per day
     */
    protected $maxAttempts = 5;

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $ip       = $request->ip();
        $cacheKey = 'registration_attempts_' . $ip;

        $attempts = Cache::get($cacheKey, 0);

        if ($attempts >= $this->maxAttempts) {
            return Response::json([
                'message' => 'You have reached the maximum number of registrations for today.',
            ], 429); // HTTP 429 Too Many Requests
        }

        // Increment attempt count and set expiration to the end of the day
        $expiresAt = now()->endOfDay();
        Cache::put($cacheKey, $attempts + 1, $expiresAt);

        return $next($request);
    }
}
