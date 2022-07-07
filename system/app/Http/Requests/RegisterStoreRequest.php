<?php

namespace App\Http\Requests;

use App\Rules\SafePassword;
use Illuminate\Foundation\Http\FormRequest;

class RegisterStoreRequest extends FormRequest
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
        return [
            'email' => 'required|email|unique:users',
            //'full_name' => 'required|string|min:4|regex:/^[\p{L}\s\d-’]+$/ui|max:50',
            'full_name' => ['required', 'string', 'min:3', 'max:100', 'regex:/^[\pL ]+$/u'],
            //'password' => 'required|confirmed|min:5'
            'password' => ['required', 'string', 'confirmed', 'min:6', 'max:100', new SafePassword]
        ];
    }
}
