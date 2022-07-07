<?php

namespace App\Traits;

use App\Http\Resources\BaseResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponse
{
    /**
     * @param $data
     * @param $code
     * @return JsonResponse
     */
    protected function successResponse($data, $code)
    {
        return response()->json(['success' => 1, 'data' => $data], $code);
    }

    /**
     * @param $message
     * @param $code
     * @return JsonResponse
     */
    protected function errorResponse($message, $code)
    {
        return response()->json(['success' => 0, 'error' => $message], $code);
    }

    /**
     * @param mixed $collection
     * @param $code
     * @return JsonResponse
     */
    protected function showAll($collection, $code = 200)
    {

        //$collection = $this->filterData($collection);
        //$collection = $this->sortData($collection);

        if($collection instanceof ResourceCollection){
            return $collection->additional(['success' => 1])->response()->setStatusCode($code);
        }

        return $this->successResponse($collection, $code);

    }

    /**
     * @param mixed $instance
     * @param $code
     * @return JsonResponse
     */
    protected function showOne($instance, $code = 200)
    {
        if($instance instanceof JsonResource){
            return $instance->additional(['success' => 1])->response()->setStatusCode($code);
        }

        return $this->successResponse($instance, $code);
    }

    /**
     * @param $message
     * @param $code
     * @return JsonResponse
     */
    protected function showMessage($message, $code = 200)
    {
        return $this->successResponse($message, $code);
    }

    /**
     * @return Response
     */
    protected function emptyResponse()
    {
        return response()->noContent();
    }

    /**
     * @param Collection $collection
     * @return Collection
     */
    private function filterData(Collection $collection)
    {
        foreach (request()->query() as $query => $value) {
            $collection = $collection->where($query, $value);
        }

        return $collection;
    }

    /**
     * @param Collection $collection
     * @return Collection
     */
    private function sortData(Collection $collection)
    {
        if (request()->has('sort_by')) {
            $collection = $collection->sortBy->{request()->sort_by};
        }

        return $collection;
    }

    private function paginate(AnonymousResourceCollection $collection)
    {
        $rules = [
            'per_page' => 'integer|min:2|max:50',
        ];

        Validator::validate(request()->all(), $rules);

        $page = LengthAwarePaginator::resolveCurrentPage();

        $perPage = config('constants.per_page');
        if (request()->has('per_page')) {
            $perPage = (int) request()->per_page;
        }

        $results = $collection->slice(($page - 1) * $perPage, $perPage)->values();

        $paginated = new LengthAwarePaginator($results, $collection->count(), $perPage, $page, [
            'path' => LengthAwarePaginator::resolveCurrentPath(),
        ]);

        $paginated->appends(request()->all());

        return $paginated;

    }

    private function transformCollection(Collection $collection, BaseResource $transformer){
        return $transformer->getCollection($collection);
    }


}
