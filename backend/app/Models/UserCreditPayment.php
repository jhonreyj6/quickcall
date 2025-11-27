<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCreditPayment extends Model
{
    protected $fillable = [
        'user_id',
        'stripe_payment_intent_id',
    ];
}
