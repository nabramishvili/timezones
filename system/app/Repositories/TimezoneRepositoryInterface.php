<?php
namespace App\Repositories;

use App\Http\Requests\TimezoneStoreRequest;
use App\Http\Requests\TimezoneUpdateRequest;
use App\Models\Timezone;
use App\Models\User;

interface TimezoneRepositoryInterface
{
    public function all($user_id = false);
    public function create(TimezoneStoreRequest $request);
    public function update(Timezone $user, TimezoneUpdateRequest $request);
    public function destroy(Timezone $user);
}
