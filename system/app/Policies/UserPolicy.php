<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Models\Role;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param User $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $user->can('view_users');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param User $model
     * @return mixed
     */
    public function view(User $user, User $model)
    {
        return $user->can('view_users') || ($user->can('view_profile') && $user->id === $model->id);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        if (!$user->can('add_users')) {
            return false;
        }

        return $this->checkValidRole($user);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param User $model
     * @return mixed
     */
    public function update(User $user, User $model)
    {
        if ($user->can('edit_admins')) {
            return true;
        }
        if ($user->can('edit_managers')) {
            $modelRoleId = $model->getRoleId();
            return $this->checkValidRole($user) &&
                ($modelRoleId === User::$ROLE_USER || $modelRoleId === User::$ROLE_MANAGER || $user->id === $model->id);
        }
        if ($user->can('edit_users')) {
            return $this->checkValidRole($user)
                && ($model->getRoleId() === User::$ROLE_USER || $user->id === $model->id);
        }
        return $user->id === $model->id;

    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param User $model
     * @return mixed
     */
    public function delete(User $user, User $model)
    {
        if ($user->can('delete_admins')) {
            return true;
        }
        if ($user->can('delete_managers')) {
            $modelRoleId = $model->getRoleId();
            return $modelRoleId === User::$ROLE_USER || $modelRoleId === User::$ROLE_MANAGER;
        }
        if ($user->can('delete_users')) {
            return $model->getRoleId() === User::$ROLE_USER;
        }
        return false;
    }

    /**
     * Determine whether user is authorized to set the provided role.
     *
     * @param User $user
     * @return boolean
     */
    private function checkValidRole(User $user)
    {
        $role = request('role');
        if (!$role) {
            //if we don't have role in request, then we know its UserUpdateRequest,
            //since UserStoreRequest would have already invalidated a request without role,
            //so we don't need to check for valid role if client didn't provide it
            return true;
        }
        if ($user->can('add_admins')) {
            $roles = Role::all()->pluck('id');
        } else if ($user->can('add_managers')) {
            $roles = Role::where('id', '<>', User::$ROLE_ADMIN)->get()->pluck('id');
        } else {
            $roles = Role::where('id', User::$ROLE_USER)->get()->pluck('id');
        }
        return $roles->contains($role);
    }

}
