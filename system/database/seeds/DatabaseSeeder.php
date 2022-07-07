<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $this->call([
            PermissionsSeeder::class,
            UserSeeder::class,
            AvailableTimezonesSeeder::class,
            TimezoneSeeder::class,
        ]);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        Artisan::call('client:create --name="Password Grant Timezones Frontend"');
    }
}
