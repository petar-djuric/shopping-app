<?php

namespace App\Http\Controllers\ShoppingList;

use App\Events\CreatedShoppingListItemEvent;
use App\Events\DeletedShoppingItemEvent;
use App\Events\UpdatedShoppingItemEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShoppingList\ShoppingListItemRequest;
use App\Models\ListItemUnit;
use App\Models\ShoppingList;
use App\Models\ShoppingListItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ShoppingListItemController extends Controller
{

    public function unit(): JsonResponse
    {
        return response()->json(ListItemUnit::all());
    }

    public function store(ShoppingListItemRequest $request, ShoppingList $shoppingList): JsonResponse
    {
        $data = $this->getValidatedData($request->validated(), $shoppingList);

        $shoppingListItem = ShoppingListItem::create($data);

        $shoppingListItem->load('listItemUnit');

        try {
            broadcast(new CreatedShoppingListItemEvent($shoppingListItem, $shoppingList))->toOthers();
        } catch (\Exception $exception) {
            logger('broadcast-CreatedShoppingListItemEvent-error', (array) $exception);
        }

        return response()->json($shoppingListItem, 201);
    }

    public function getValidatedData(array $validated, ShoppingList $shoppingList): array
    {
        $data = [
            'item_name' => $validated['item_name'],
            'shopping_list_id' => $shoppingList->id,
            'is_checked' => $validated['is_checked'] ?? false,
        ];

        if (isset($validated['quantity']) && isset($validated['list_item_unit_id'])) {
            $data['quantity'] = $validated['quantity'];
            $data['list_item_unit_id'] = $validated['list_item_unit_id'];
        } else {
            $data['quantity'] = null;
            $data['list_item_unit_id'] = null;
        }
        return $data;
    }

    public function update(ShoppingListItemRequest $request, ShoppingList $shoppingList, ShoppingListItem $shoppingListItem): JsonResponse
    {
        $data = $this->getValidatedData($request->validated(), $shoppingList);


        $shoppingListItem->update($data);

        try {
            broadcast(new UpdatedShoppingItemEvent($shoppingListItem, $shoppingList))->toOthers();
        } catch (\Exception $exception) {
            logger('broadcast-UpdatedShoppingItemEvent-error', (array) $exception);
        }

        return response()->json([
            'message' => 'List item updated'
        ]);
    }

    public function destroy(Request $request, ShoppingList $shoppingList, ShoppingListItem $shoppingListItem): JsonResponse
    {
        Gate::authorize('viewOrModify', $shoppingList);

        $shoppingListItem->delete();

        try {
            broadcast(new DeletedShoppingItemEvent($shoppingListItem->id, $shoppingList))->toOthers();
        } catch (\Exception $exception) {
            logger('broadcast-DeletedShoppingItemEvent-error', (array) $exception);
        }

        return response()->json([
            'message' => 'List item deleted'
        ]);
    }
}
