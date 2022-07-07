<?php /** @noinspection PhpPossiblePolymorphicInvocationInspection */

namespace App\Repositories\Eloquent;

use App\Http\Requests\TimezoneStoreRequest;
use App\Http\Requests\TimezoneUpdateRequest;
use App\Models\Timezone;
use App\Models\User;
use App\Repositories\TimezoneRepositoryInterface;
use App\Traits\ApiResponse;
use Exception;
use Illuminate\Http\JsonResponse;

class TimezoneRepository extends BaseRepository implements TimezoneRepositoryInterface
{

    use ApiResponse;

    /**
     * TimezoneRepository constructor.
     *
     * @param Timezone $model
     */
    public function __construct(Timezone $model)
    {
        parent::__construct($model);
    }

    /**
     * @param mixed $user_id
     * @return mixed
     */
    public function all($user_id = false)
    {
        $perPage = config('constants.per_page');
        if (request()->has('per_page') && (int)request('per_page') <= config('constants.max_per_page')) {
            $perPage = (int)request('per_page');
        }
        $available_sorts = ['name', 'city', 'offset', 'id'];

        $sortBy = request('sortby') && in_array(request('sortby'), $available_sorts) ? request('sortby') : "id";
        $order = request('order') && in_array(request('order'), ['desc', 'asc']) ? request('order') : "desc";
        $query = $this->model->query();
        if ($user_id) {
            $query = $query->where('user_id', $user_id);
        }
        if (request()->has('search')) {
            $query = $query->where(function ($q) {
                $q->where('name', 'like', '%' . (string)request('search') . '%')
                    ->orWhere('city', 'like', '%' . (string)request('search') . '%');
            });
        }

        return $query->orderBy($sortBy, $order)->paginate($perPage)->appends(request()->input());
    }

    /**
     * @param TimezoneStoreRequest $request
     * @return Timezone
     */
    public function create(TimezoneStoreRequest $request)
    {
        $data = $request->only(['name', 'city', 'offset', 'user_id']);
        if (!$request->user_id || !$request->user()->can('add_timezones')) {
            $data['user_id'] = $request->user()->id;
        }
        return $this->model->create($data);
    }

    /**
     * @param Timezone $timezone
     * @param TimezoneUpdateRequest $request
     * @return Timezone|JsonResponse
     */
    public function update(Timezone $timezone, TimezoneUpdateRequest $request)
    {
        if ($request->has('name')) {
            $timezone->name = $request->name;
        }
        if ($request->has('city')) {
            $timezone->city = $request->city;
        }
        if ($request->has('offset')) {
            $timezone->offset = $request->offset;
        }
        if ($request->has('user_id')) {
            $timezone->user_id = $request->user_id;
        }

        if (!$timezone->isDirty()) {
            return $this->errorResponse(__('errors.nothing_changed'), 422);
        }

        $timezone->save();

        return $timezone;
    }

    /**
     * @param Timezone $timezone
     * @throws Exception
     */
    public function destroy(Timezone $timezone)
    {
        $timezone->delete();
    }
}
