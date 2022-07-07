<?php /** @noinspection PhpPossiblePolymorphicInvocationInspection */

namespace App\Repositories\Eloquent;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use App\Traits\ApiResponse;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{

    use ApiResponse;

    /**
     * UserRepository constructor.
     *
     * @param User $model
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * @return mixed
     */
    public function all()
    {
        $perPage = config('constants.per_page');
        if (request()->has('per_page') && (int)request('per_page') <= config('constants.max_per_page')) {
            $perPage = (int)request('per_page');
        }
        $available_sorts = ['full_name', 'email', 'created_at', 'id'];
        $sortBy = request('sortby') && in_array(request('sortby'), $available_sorts) ? request('sortby') : "id";
        $order = request('order') && in_array(request('order'), ['desc', 'asc']) ? request('order') : "desc";
        $query = $this->model->query();
        if (request()->has('search')) {
            $query = $query->where(function ($q) {
                $q->where('full_name', 'like', '%' . (string)request('search') . '%')
                    ->orWhere('email', 'like', '%' . (string)request('search') . '%');
            });
        }
        if (request()->has('role')) {
            $roles = explode(",", (string)request('role'));
            $query = $query->whereHas('roles', function ($q) use ($roles) {
                $q->whereIn('name', $roles);
            });
        }
//        if(request()->has('verified')){
//            $verified = explode(",", (string)request('verified'));
//            $query = $query->whereIn('verified', $verified);
//        }
        return $query->orderBy($sortBy, $order)->paginate($perPage)->appends(request()->input());
    }


    /**
     * @param Request $request
     * @return User
     */
    public function create(Request $request)
    {
        $data = $request->only(['full_name', 'email', 'password']);
        $data['email_verify_token'] = hash('sha256', Str::random(40));
        $data['password_reset_token'] = hash('sha256', Str::random(40));
        if ($request instanceof UserStoreRequest) {
            $data['email_verified_at'] = $request->verified ? now() : null;
        }
        $data['password'] = bcrypt($data['password']);
        $user = $this->model->create($data);
        if ($request->role) {
            $user->assignRole(Role::find($request->role));
        } else {
            $user->assignRole(Role::find(User::$ROLE_USER));
        }
        return $user;
    }

    /**
     * @param User $user
     * @param UserUpdateRequest $request
     * @return User|JsonResponse
     */
    public function update(User $user, UserUpdateRequest $request)
    {
        $roleChanged = false;

        if ($request->has('full_name')) {
            $user->full_name = $request->full_name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = bcrypt($request->password);
        }

        if ($request->has('role')) {
            $userRole = $user->getRole();
            $role = Role::find($request->role);
            if ($userRole !== $role->name) {
                $roleChanged = true;
                $user->syncRoles([$role]);
            }
        }

        if ($request->has('verified')) {
            if ((int)request('verified') !== (int)!!$user->email_verified_at) {
                $user->email_verified_at = $request->verified ? now() : null;
            }
        }

        if (!$user->isDirty() && !$roleChanged) {
            return $this->errorResponse(__('errors.nothing_changed'), 422);
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return $user;
    }

    /**
     *
     * Gracefully delete user after deleting all of their timezones
     *
     * @param User $user
     * @throws Exception
     */
    public function destroy(User $user)
    {
        $user->timezones()->delete();
        $user->delete();
    }
}
