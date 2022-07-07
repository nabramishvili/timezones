<?php

namespace App\Http\Requests;

use App\Rules\SafePassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $arr = explode("/", $this->url());
        $userId = $arr[count($arr)-1];

        return [
            'email' => [
                'email',
                Rule::unique('users')->ignore($userId),
            ],
            //'full_name' => 'string|min:4|regex:/^[\p{L}\s\d-’]+$/ui|max:100',
            'full_name' => ['string', 'min:3', 'max:100', 'regex:/^[\pL ]+$/u'],
            //'password' => 'confirmed|min:5',
            'password' => ['string', 'confirmed','min:6', 'max:100', new SafePassword],
            'verified' => [Rule::in([0,1])],
            'role' => 'integer|exists:roles,id'
        ];
    }
}
