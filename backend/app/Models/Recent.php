<?php
namespace App\Models;

use App\Casts\DiffForHumansCast;
use Illuminate\Database\Eloquent\Model;

class Recent extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'phone_number',
        'called_at',
        'call_type',
    ];

    public $casts = [
        'called_at' => DiffForHumansCast::class,
    ];
}
