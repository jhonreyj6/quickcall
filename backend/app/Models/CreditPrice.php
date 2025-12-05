<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditPrice extends Model
{
    protected $fillable = [
        'stripe_product_id',
        'package_name',
        'price',
    ];
}
