<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'created_at' => (string)$this->created_at,
            'role' => $this->getRole(),
            'role_id'=> $this->getRoleId(),
            'verified' => (int)!!$this->email_verified_at
        ];
    }
}
