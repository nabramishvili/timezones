<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\ApiController;
use App\Http\Requests\PasswordResetRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Mail\ResetPasswordRequest;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\User as UserResource;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends ApiController
{

    private $userRepository;

    /**
     * UserController constructor.
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);
        $users = $this->userRepository->all();
        $usersCollection = new UserCollection($users);
        return $this->showAll($usersCollection);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UserStoreRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(UserStoreRequest $request)
    {
        $this->authorize('create', User::class);
        $user = $this->userRepository->create($request);
        return $this->showOne(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        return $this->showOne(new UserResource($user));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserUpdateRequest $request
     * @param User $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $this->authorize('update', $user);
        $response = $this->userRepository->update($user, $request);

        if($response instanceof JsonResponse){
            return $response;
        }

        return $this->showOne(new UserResource($response));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $this->userRepository->destroy($user);
        return $this->emptyResponse();
    }


    /**
     * @param $token
     *
     * Verify user's email address using email verification token
     *
     * @return mixed
     */
    public function verify($token)
    {
        $user = User::where('email_verify_token', $token)->first();
        if(!$user){
            return $this->errorResponse(__('errors.email_invalid_token'), 400);
        }
        $user->email_verified_at = now();
        $user->email_verify_token = hash('sha256', Str::random(40));
        $user->save();
        return response(__('messages.account_verified'));
    }

    /**
     * @param PasswordResetRequest $request
     * @return mixed
     */
    public function requestResetPassword(PasswordResetRequest $request)
    {
        if(!config('app.emails_enabled')) {
            return $this->errorResponse(__('errors.emails_disabled'), 400);
        }
        try {
            $user = User::where('email', $request->email)->first();
            Mail::to($user->email)->send(new ResetPasswordRequest($user));
        }catch (\Exception $e){
            //mail was not sent
            Log::warning('failed to send reset password email to: '.$user->email);
        }
        return response(__('messages.password_reset_sent'));
    }

    /**
     * @param $token
     *
     * Send user new password after verifying password reset token
     *
     * @return mixed
     */
    public function resetPassword($token)
    {
        if(!config('app.emails_enabled')) {
            return $this->errorResponse(__('errors.emails_disabled'), 400);
        }
        $user = User::where('password_reset_token', $token)->first();
        if(!$user){
            return $this->errorResponse(__('errors.password_invalid_token'), 400);
        }
        $user->password_reset_token = hash('sha256', Str::random(40));
        $newPassword = Str::random(10);
        $user->password = bcrypt($newPassword);
        $user->save();
        return response(__('messages.password_sent'));
    }
}

