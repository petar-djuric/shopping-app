<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GroupRequest extends FormRequest
{

    public function authorize(): bool
    {
        return $this->user()->can('update', $this->group);
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required', 'string', 'email', 'max:255', Rule::exists('users', 'email')->where(function ($query) {
                    return $query->whereNull('group_id');
                }),
            ]
        ];
    }
}
