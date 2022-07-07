<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AvailableTimezonesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('available_timezones')->truncate();

        $timezones = [
            '+14:00',
            '+13:00',
            '+12:45',
            '+12:00',
            '+11:00',
            '+10:30',
            '+10:00',
            '+09:30',
            '+09:00',
            '+08:45',
            '+08:00',
            '+07:00',
            '+06:30',
            '+06:00',
            '+05:45',
            '+05:30',
            '+05:00',
            '+04:30',
            '+04:00',
            '+03:00',
            '+02:00',
            '+01:00',
            '+00:00',
            '-01:00',
            '-02:00',
            '-02:30',
            '-03:00',
            '-04:00',
            '-05:00',
            '-06:00',
            '-07:00',
            '-08:00',
            '-09:00',
            '-09:30',
            '-10:00',
            '-11:00',
            '-12:00'
        ];

        foreach ($timezones as $timezone){
            DB::table('available_timezones')->insert(['offset' => $timezone]);
        }
    }
}
