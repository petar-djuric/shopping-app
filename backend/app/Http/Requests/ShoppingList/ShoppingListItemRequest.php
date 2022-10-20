<?php

namespace App\Http\Requests\ShoppingList;

use Illuminate\Foundation\Http\FormRequest;

class ShoppingListItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('viewOrModify', $this->shoppingList);
    }

    public function rules(): array
    {
        return [
            'item_name' => ['required', 'string', 'max:255'],
            'quantity' => ['numeric', 'between:0,999999.99', 'required_with:list_item_unit_id'],
            'list_item_unit_id' => ['numeric', 'exists:App\Models\ListItemUnit,id', 'required_with:quantity'],
            'is_checked' => ['boolean']
        ];
    }
}
