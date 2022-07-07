<?php

namespace App\Providers;

use App\Mail\VerifyEmail;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //config(['auth.defaults.guard' => 'api']);
        Schema::defaultStringLength(191);

        if(config('app.emails_enabled')) {
            User::created(function ($user) {
                try {
                    Mail::to($user->email)->send(new VerifyEmail($user));
                }catch (\Exception $e){
                    //mail was not sent
                    Log::warning('failed to send email verification email to: '.$user->email);
                }
            });
        }

        if(config('app.emails_enabled')) {
            User::updated(function ($user) {
                if ($user->isDirty('email')) {
                    try {
                        Mail::to($user->email)->send(new VerifyEmail($user));
                    }catch (\Exception $e){
                        //mail was not sent
                        Log::warning('failed to send email verification email to: '.$user->email);
                    }
                }
            });
        }
    }
}
