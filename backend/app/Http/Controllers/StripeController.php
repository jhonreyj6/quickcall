<?php
namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripeController extends Controller
{

    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $user = Auth::user(); // Make sure user is logged in

            // Create PaymentIntent for $10 (1000 cents)
            $paymentIntent = PaymentIntent::create([
                'amount'                    => 1000,
                'currency'                  => 'usd',
                'automatic_payment_methods' => [
                    'enabled'         => true,
                    'allow_redirects' => 'always',
                ],
                'metadata'                  => [
                    'user_id' => $user->id,
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                // 'payment_intent_id'           => $paymentIntent->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function confirmPayment(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $piId = explode('_secret_', $request->client_secret)[0];
        try {

            $paymentIntent = PaymentIntent::retrieve($piId);
            if ($paymentIntent->status === 'succeeded') {
                // Payment is successful, fulfill the order
                return response()->json(['success' => true, 'message' => 'Payment confirmed!']);
            }

            return response()->json(['success' => false, 'status' => $paymentIntent->status]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}
