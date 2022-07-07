<?php

namespace App\Http\Controllers\Timezone;

use App\Http\Controllers\ApiController;
use App\Http\Requests\TimezoneStoreRequest;
use App\Http\Requests\TimezoneUpdateRequest;
use App\Http\Resources\TimezoneCollection;
use App\Models\Timezone;
use App\Http\Resources\Timezone as TimezoneResource;
use App\Repositories\TimezoneRepositoryInterface;
use DateInterval;
use DateTime;
use DateTimeZone;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TimezoneController extends ApiController
{

    private $timezoneRepository;

    /**
     * UserController constructor.
     * @param TimezoneRepositoryInterface $timezoneRepository
     */
    public function __construct(TimezoneRepositoryInterface $timezoneRepository)
    {
        $this->timezoneRepository = $timezoneRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function index()
    {
        $this->authorize('viewOwn', Timezone::class);
        $timezones = $this->timezoneRepository->all(request()->user()->id);
        $timezonesCollection = new TimezoneCollection($timezones);
        return $this->showAll($timezonesCollection);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TimezoneStoreRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(TimezoneStoreRequest $request)
    {
        $this->authorize('create', Timezone::class);
        $timezone = $this->timezoneRepository->create($request);
        return $this->showOne(new TimezoneResource($timezone), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Timezone $timezone
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function show(Timezone $timezone)
    {
        $this->authorize('view', $timezone);
        return $this->showOne(new TimezoneResource($timezone));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TimezoneUpdateRequest $request
     * @param Timezone $timezone
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(TimezoneUpdateRequest $request, Timezone $timezone)
    {
        $this->authorize('update', $timezone);
        $response = $this->timezoneRepository->update($timezone, $request);

        if($response instanceof JsonResponse){
            return $response;
        }

        return $this->showOne(new TimezoneResource($response));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Timezone $timezone
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(Timezone $timezone)
    {
        $this->authorize('delete', $timezone);
        $this->timezoneRepository->destroy($timezone);
        return $this->emptyResponse();
    }

    /**
     * Get available offsets.
     *
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function getAvaliableOffsets(){
        $this->authorize('create', Timezone::class);
        $offsets = DB::table('available_timezones')->get()->pluck('offset');
        return $this->showAll($offsets);
    }

    /**
     * Get all timezones.
     *
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function getAllTimezones(){
        $this->authorize('viewAny', Timezone::class);
        $timezones = $this->timezoneRepository->all();
        $timezonesCollection = new TimezoneCollection($timezones);
        return $this->showAll($timezonesCollection);
    }

//    /**
//     * Get current timezone data
//     *
//     * @param Timezone $timezone
//     * @return JsonResponse
//     * @throws AuthorizationException
//     * @throws Exception
//     */
//    public function getTimezoneFullData(Timezone $timezone)
//    {
//        $this->authorize('viewTime', $timezone);
//        $date_utc = new DateTime("now", new DateTimeZone("UTC"));
//        $date = clone $date_utc;
//        $difference = $timezone->offset;
//        $split = explode(":", $difference);
//        $hours = intval($split[0]);
//        $minutes = intval($split[1]);
//        $offsetInMinutes = $hours * 60 + ($hours < 0 ? (-$minutes) : $minutes);
//        $date->modify("$offsetInMinutes minutes");
//        $date_utc = $date_utc->format('Y-m-d H:i');
//        $date = $date->format('Y-m-d H:i');
//        return $this->showOne([
//            'date_utc' => $date_utc,
//            'date_timezone' => $date,
//            'offset' => $difference,
//            'timezone'=> new TimezoneResource($timezone)
//        ]);
//    }

}

