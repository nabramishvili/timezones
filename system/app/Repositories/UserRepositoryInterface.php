<?php
namespace App\Repositories;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;

interface UserRepositoryInterface
{
    public function all();
    public function create(Request $request);
    public function update(User $user, UserUpdateRequest $request);
    public function destroy(User $user);
}
