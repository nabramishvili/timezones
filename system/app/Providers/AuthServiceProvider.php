<?php

namespace App\Providers;

use App\Models\Timezone;
use App\Models\User;
use App\Policies\TimezonePolicy;
use App\Policies\UserPolicy;
use Carbon\Carbon;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{

    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Timezone::class => TimezonePolicy::class
    ];


    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //Bootstrap oauth2 server
        Passport::routes();
        Passport::tokensExpireIn(now()->addHours(3));
        Passport::refreshTokensExpireIn(Carbon::now()->addDays(30));

//        Uncomment to implicitly grant "Admin" role all permissions
//        Gate::before(function ($user, $ability) {
//            return $user->hasRole('admin') ? true : null;
//        });

    }
}
