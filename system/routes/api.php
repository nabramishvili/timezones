<?php

use Illuminate\Support\Facades\Route;

$authMiddleware = ['auth:api'];
if(config('app.force_email_verify')){
    $authMiddleware[] = 'emailVerified';
}

//PUBLIC ROUTES
Route::name('verify')->get('users/verify/{token}', 'User\UserController@verify');

//GUEST ROUTES
Route::group(['middleware' => 'guest'], function () {
    Route::name('reset_password_request')->post('users/reset_request', 'User\UserController@requestResetPassword');
    Route::name('reset_password')->get('users/reset/{token}', 'User\UserController@resetPassword');
    Route::post('auth/register', 'Auth\AuthController@register');
});

//PROTECTED ROUTES
Route::group(['middleware' => $authMiddleware], function () {
    //USERS
    Route::resource('users', 'User\UserController', ['except' => ['create', 'edit']]);
    Route::resource('users.timezones', 'User\UserTimezoneController', ['only' => ['index']]);
    //TIMEZONES
    Route::get('timezones/available', 'Timezone\TimezoneController@getAvaliableOffsets');
    Route::get('timezones/all', 'Timezone\TimezoneController@getAllTimezones');
    Route::resource('timezones', 'Timezone\TimezoneController', ['except' => ['create', 'edit']]);
    //Route::get('timezones/{timezone}/current', 'Timezone\TimezoneController@getTimezoneFullData');
    //AUTH
    Route::post('auth/logout', 'Auth\AuthController@logout');
    Route::get('auth/me', 'Auth\AuthController@me');
});

