<?php

namespace App\Policies;

use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShoppingListPolicy
{
    use HandlesAuthorization;

    public function viewOrModify(User $user, ShoppingList $shoppingList): bool
    {
        return $user->group_id === $shoppingList->group_id;
    }
}
