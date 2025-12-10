<?php
namespace App\Http\Controllers;

use App\Models\CreditPrice;
use App\Models\UserCreditPayment;
use Auth;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Stripe\PaymentMethod;
use Stripe\Stripe;

class StripeController extends Controller
{

    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $product = CreditPrice::where('package_name', $request->package_name)->firstOrFail();

        try {
            $user = Auth::user();
            $paymentIntent = PaymentIntent::create([
                'amount' => $product->price * 100,
                'currency' => 'usd',
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'always',
                ],
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function confirmPayment(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $paymentIntent = PaymentIntent::retrieve($request->input('payment_intent_id'));
        // for saving pm
        $paymentMethodId = $paymentIntent->payment_method;
        $paymentMethod = PaymentMethod::retrieve($paymentMethodId);

        if ($paymentIntent->status === 'succeeded') {
            $existing = UserCreditPayment::where('stripe_payment_intent_id', $paymentIntent->id)->first();

            if ($existing) {
                return response()->json(['success' => false, 'messsage' => 'Transaction already exist!'], 409);
            } else {
                UserCreditPayment::create([
                    'user_id' => $request->user()->id,
                    'stripe_payment_intent_id' => $request->input('payment_intent_id'),
                    'amount' => $paymentIntent->amount_received / 100,
                ]);
                $request->user()->increment('credit_balance', $paymentIntent->amount_received / 100);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment confirmed!',
                    'user' => auth()->user(),
                ],
                    201);
            }
        }
    }

}
