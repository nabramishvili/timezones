<?php

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::flushEventListeners();

        factory(User::class, 100)->create();

        $users = User::all();
        $roles = Role::where('name', '<>', 'admin')->get();

        //Create one admin and many users and managers
        foreach ($users as $user) {
            if ($user->id === 1) {
                $user->email = 'admin@example.net';
                $user->save();
                $user->assignRole(Role::findByName('admin', 'api'));
            }
            else if ($user->id === 2) {
                $user->email = 'manager@example.net';
                $user->save();
                $user->assignRole(Role::findByName('manager', 'api'));
            }
            else if ($user->id === 3) {
                $user->email = 'user@example.net';
                $user->save();
                $user->assignRole(Role::findByName('user', 'api'));
            }
            else if ($user->id === 4) {
                $user->email = 'user2@example.net';
                $user->save();
                $user->assignRole(Role::findByName('user', 'api'));
            }
            else {
                $randomRole = $roles->shuffle()->first();
                $user->assignRole($randomRole);
            }
        }

    }
}
