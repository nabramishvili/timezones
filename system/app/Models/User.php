<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{
    use Notifiable, HasApiTokens, HasRoles;

    public static $ROLE_USER = 1;
    public static $ROLE_MANAGER = 2;
    public static $ROLE_ADMIN = 3;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name', 'name', 'email', 'password', 'email_verify_token', 'password_reset_token', 'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get user's role
     *
     * @return string
     */
    public function getRole()
    {
        return $this->roles->pluck('name')->first();
    }

    /**
     * Get user's role id
     *
     * @return int
     */
    public function getRoleId()
    {
        return $this->roles->pluck('id')->first();
    }

    /**
     *
     * Relationship with timezones: user has many timezones
     *
     * @return HasMany
     */
    public function timezones()
    {
        return $this->hasMany(Timezone::class);
    }
}
