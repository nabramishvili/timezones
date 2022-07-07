<?php

use App\Models\Timezone;
use Illuminate\Database\Seeder;

class TimezoneSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //uncomment below line if you have any custom events attached
        //Timezone::flushEventListeners();

        Timezone::truncate();
        factory(Timezone::class, 1000)->create();
        $timezones = Timezone::take(150)->get();
        $count = 0;
        //populate first 3 users with many timezones for testing purposes
        foreach ($timezones as $timezone){
            if($count < 50){
                $timezone->user_id = 1;
            }
            elseif($count >= 50 && $count < 100){
                $timezone->user_id = 2;
            }
            else{
                $timezone->user_id = 3;
            }
            $count++;
            $timezone->save();
        }

    }
}
