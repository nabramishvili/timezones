<?php

namespace App\Http\Controllers\User;

use App\Http\Resources\TimezoneCollection;
use App\Models\Timezone;
use App\Models\User;
use App\Repositories\TimezoneRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Response;
use App\Http\Resources\Timezone as TimezoneResource;

class UserTimezoneController extends ApiController
{

    private $timezoneRepository;

    /**
     * UserTimezoneController constructor.
     * @param TimezoneRepositoryInterface $timezoneRepository
     */
    public function __construct(TimezoneRepositoryInterface $timezoneRepository)
    {
        $this->timezoneRepository = $timezoneRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param User $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function index(User $user)
    {
        $this->authorize('viewOwn', Timezone::class);
        if(request()->user()->id!==$user->id){
            $this->authorize('viewAny', Timezone::class);
        }
        $timezones = $this->timezoneRepository->all($user->id);
        $timezonesCollection = new TimezoneCollection($timezones);
        return $this->showAll($timezonesCollection);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param User $user
     * @param Timezone $timezone
     * @return JsonResponse
     */
    public function update(User $user, Timezone $timezone)
    {
        $timezone->user_id = $user->id;
        $timezones = $user->timezones;
        return $this->showAll(new TimezoneCollection($timezones));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @param Timezone $timezone
     * @return Response
     */
    public function destroy(User $user, Timezone $timezone)
    {
        $this->timezoneRepository->destroy($timezone);
        return $this->emptyResponse();
    }
}
