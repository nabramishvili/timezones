<?php

namespace App\Policies;

use App\Models\Timezone;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Models\Role;

class TimezonePolicy
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
        return $user->can('view_timezones');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Timezone $model
     * @return mixed
     */
    public function view(User $user, Timezone $model)
    {
        return $user->can('view_timezones') || ($user->can('view_timezones_own') && $user->id === $model->user_id);
    }

    /**
     * Determine whether the user can view his own models.
     *
     * @param User $user
     * @return mixed
     */
    public function viewOwn(User $user)
    {
        return $user->can('view_timezones_own');
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('add_timezones');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param Timezone $model
     * @return mixed
     */
    public function update(User $user, Timezone $model)
    {
        return $user->can('edit_timezones') || ($user->can('edit_timezones_own') && $user->id === $model->user_id);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param Timezone $model
     * @return mixed
     */
    public function delete(User $user, Timezone $model)
    {
        return $user->can('delete_timezones') || ($user->can('delete_timezones_own') && $user->id === $model->user_id);
    }

    /**
     * Determine whether the user can view current time of timezone
     *
     * @param User $user
     * @param Timezone $model
     * @return mixed
     */
    public function viewTime(User $user, Timezone $model)
    {
        return $user->can('view_timezone_full') &&
            ($user->can('view_timezones') || ($user->can('view_timezones_own') && $user->id === $model->user_id));
    }


}
