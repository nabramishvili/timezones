<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimezoneStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->can('add_timezones');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:100',
            //'city' => 'required|string|max:100',
            'city' => ['required', 'string', 'min:2', 'max:100', 'regex:/^[\pL.,\-\' ]+$/u'],
            'offset' => 'required|exists:available_timezones,offset',
            'user_id' => 'integer|exists:users,id'
        ];
    }
}
