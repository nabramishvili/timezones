<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\ApiController;
use App\Http\Requests\RegisterStoreRequest;
use App\Repositories\UserRepositoryInterface;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\User as UserResource;

class AuthController extends ApiController
{

    private $userRepository;

    /**
     * AuthController constructor.
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Log out existing user
     *
     * @return Response
     */
    public function logout()
    {
        $accessToken = request()->user()->token();
        DB::table('oauth_refresh_tokens')
            ->where('access_token_id', $accessToken->id)
            ->update([
                'revoked' => true
            ]);
        $accessToken->revoke();
        return $this->emptyResponse();
    }

    /**
     * Register a new user
     *
     * @param RegisterStoreRequest $request
     * @return JsonResponse
     */
    public function register(RegisterStoreRequest $request)
    {
        $user = $this->userRepository->create($request);
        //$user->assignRole(Role::findByName('user', 'api'));
        return $this->showOne(new UserResource($user), 201);
    }


    /**
     * @param Request $request
     *
     * Return authenticated user with role
     *
     * @return JsonResponse
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user['role'] = $user->getRole();
        $user['role_id'] = $user->getRoleId();
        $user['verified'] = (int)!!$user->email_verified_at;
        $allowed_keys = ['id', 'full_name', 'verified', 'email', 'created_at', 'role', 'role_id'];

        //If you will need to to have actual permissions in frontend, uncomment below 3 lines
        //$permissionNames = $user->getAllPermissions()->pluck('name');
        //$user['permissions'] = $permissionNames;
        //$allowed_keys[] = 'permissions';

        return $this->showOne($user->only($allowed_keys));
    }

}
