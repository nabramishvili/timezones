<?php

namespace App\Http\Resources;

use DateTime;
use DateTimeZone;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User as UserResource;

class Timezone extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     * @throws Exception
     */
    public function toArray($request)
    {
        $date_utc = new DateTime("now", new DateTimeZone("UTC"));
        $date = clone $date_utc;
        $difference = $this->offset;
        $split = explode(":", $difference);
        $hours = intval($split[0]);
        $minutes = intval($split[1]);
        $offsetInMinutes = $hours * 60 + ($hours < 0 ? (-$minutes) : $minutes);
        $date->modify("$offsetInMinutes minutes");
        $date_utc = $date_utc->format('Y-m-d H:i');
        $date = $date->format('Y-m-d H:i');
        return [
            'id' => $this->id,
            'name' => $this->name,
            'city' => $this->city,
            'offset' => $this->offset,
            'date_utc' => $date_utc,
            'date_timezone' => $date,
            'user' => new UserResource($this->user),
            'created_at' =>  (string)$this->created_at,
        ];
    }
}
