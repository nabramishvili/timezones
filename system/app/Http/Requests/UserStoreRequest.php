<?php

namespace App\Http\Requests;

use App\Rules\SafePassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if(!$this->user()->can('add_users')){
            return false;
        }
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email|unique:users',
            //'full_name' => 'required|string|max:100',
            'full_name' => ['required', 'string', 'min:3', 'max:100', 'regex:/^[\pL ]+$/u'],
            //'password' => 'required|confirmed|min:5',
            'password' => ['required', 'string', 'confirmed', 'min:6', 'max:100', new SafePassword],
            'verified' => ['required', Rule::in([0,1])],
            'role' => 'integer|exists:roles,id'
        ];
    }
}
