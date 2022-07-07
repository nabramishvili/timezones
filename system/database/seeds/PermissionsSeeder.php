<?php

use App\Models\Timezone;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $userPermissions = [
            'view_timezones_own',
            'add_timezones',
            'edit_timezones_own',
            'delete_timezones_own',
            'view_profile',
            'edit_profile',
            'view_timezone_full'
        ];

        $managerPermissions = array_merge($userPermissions, [
            'view_users',
            'add_users',
            'add_managers',
            'edit_users',
            'delete_users',
            'edit_roles'
        ]);

        $adminPermissions = array_merge($managerPermissions, [
            'add_admins',
            'edit_managers',
            'delete_managers',
            'view_timezones',
            'delete_timezones',
            'edit_timezones'
        ]);

        if (!$userRole = Role::where('name', 'user')->first()) {
            $userRole = Role::create(['id' => 1, 'guard_name' => 'api', 'name' => 'user']);
        }
        if (!$managerRole = Role::where('name', 'manager')->first()) {
            $managerRole = Role::create(['id' => 2, 'guard_name' => 'api', 'name' => 'manager']);
        }
        if (!$adminRole = Role::where('name', 'admin')->first()) {
            $adminRole = Role::create(['id' => 3, 'guard_name' => 'api', 'name' => 'admin']);
        }

        foreach ($userPermissions as $permissionName) {
            $permissionObj = Permission::where('name', $permissionName)->first();
            if (!$permissionObj) {
                $permissionObj = Permission::create(['guard_name' => 'api', 'name' => $permissionName]);
            }
            $userRole->givePermissionTo($permissionObj);
        }

        foreach ($managerPermissions as $permissionName) {
            $permissionObj = Permission::where('name', $permissionName)->first();
            if (!$permissionObj) {
                $permissionObj = Permission::create(['guard_name' => 'api', 'name' => $permissionName]);
            }
            $managerRole->givePermissionTo($permissionObj);
        }

        foreach ($adminPermissions as $permissionName) {
            $permissionObj = Permission::where('name', $permissionName)->first();
            if (!$permissionObj) {
                $permissionObj = Permission::create(['guard_name' => 'api', 'name' => $permissionName]);
            }
            $adminRole->givePermissionTo($permissionObj);
        }
    }
}
