<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Timezone;
use App\Models\User;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Timezone::class, function (Faker $faker) {
    return [
        'name' => $faker->timezone,
        'city' => $faker->city,
        'offset' => DB::table('available_timezones')->get()->random()->offset,
        'user_id' => User::all()->random()->id,
    ];
});
