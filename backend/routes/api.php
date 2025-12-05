<?php

use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/test', function (Request $request) {
    return 'test';
});

Route::group(['prefix' => 'auth', 'namespace' => 'App\Http\Controllers'], function ($router) {
    Route::post('login', 'AuthController@login')->middleware('throttle:10,15');
    Route::post('/register', 'AuthController@register');
    Route::post('/logout', 'AuthController@logout')->middleware('auth:api');
});

Route::group(['prefix' => 'recent', 'middleware' => ['auth:api'], 'namespace' => 'App\Http\Controllers'], function ($router) {
    Route::get('/', 'RecentController@index');
    // Route::post('/', 'RecentController@store');
});

Route::group(['prefix' => 'contact', 'middleware' => ['auth:api'], 'namespace' => 'App\Http\Controllers'], function ($router) {
    Route::get('/', 'ContactController@index');
    Route::get('/favorite', 'ContactController@favorite');
    Route::get('/search', 'ContactController@search');
    Route::post('/', 'ContactController@store');
});

Route::group(['prefix' => 'profile', 'middleware' => ['auth:api'], 'namespace' => 'App\Http\Controllers'], function ($router) {
    Route::post('/update', 'ProfileController@update');
});

Route::group(['prefix' => 'payment/stripe', 'middleware' => ['auth:api'], 'namespace' => 'App\Http\Controllers'], function ($router) {
    Route::post('/confirm', 'StripeController@confirmPayment');
    Route::post('/intent', 'StripeController@createPaymentIntent');
});
