<?php

namespace App\Http\Controllers\ShoppingList;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShoppingList\ShoppingListRequest;
use App\Models\Group;
use App\Models\ShoppingList;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ShoppingListController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('group.shoppingLists')->group);
    }

    /**
     * @throws AuthorizationException
     */
    public function show(Request $request, ShoppingList $shoppingList): JsonResponse
    {
        Gate::authorize('viewOrModify', $shoppingList);

        return response()->json($shoppingList->load('shoppingListItems.listItemUnit')->shoppingListItems);
    }

    public function store(ShoppingListRequest $request): JsonResponse
    {

        $user = $request->user();

        if (ShoppingList::where('group_id', $user->group_id)->exists()) {
            return response()->json([
                "message" => "Creating a new shopping list is not allowed"
            ], 400);
        }

        if (is_null($user->group_id)) {
            $groupId = Group::create([])->id;

            $user->group_id = $groupId;
            $user->save();
        }

        $validated = $request->validated();

        $list = ShoppingList::create([
            'shopping_list_name' => $validated['shopping_list_name'],
            'group_id' => $user->group_id
        ]);

        return response()->json($list, 201);
    }

    public function update(ShoppingListRequest $request, ShoppingList $shoppingList): JsonResponse
    {
        Gate::authorize('viewOrModify', $shoppingList);

        $validated = $request->validated();

        $shoppingList->update([
            'shopping_list_name' => $validated['shopping_list_name'],
        ]);

        return response()->json([
            'message' => 'List updated'
        ]);
    }

    public function destroy(ShoppingList $shoppingList): JsonResponse
    {
        Gate::authorize('viewOrModify', $shoppingList);

        $shoppingList->delete();

        return response()->json([
            'message' => 'List deleted'
        ]);
    }
}
