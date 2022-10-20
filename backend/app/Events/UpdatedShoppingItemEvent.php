<?php

namespace App\Events;

use App\Models\ShoppingList;
use App\Models\ShoppingListItem;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UpdatedShoppingItemEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ShoppingListItem $shoppingListItem;
    public ShoppingList $shoppingList;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($shoppingListItem,$shoppingList)
    {
        $this->shoppingListItem = $shoppingListItem->load('listItemUnit');
        $this->shoppingList = $shoppingList;
    }

    public function broadcastWith():array
    {
        return ['shoppingListItem' => $this->shoppingListItem];
    }

    public function broadcastAs(): string
    {
        return 'shopping-list.item.updated';
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('group.' . $this->shoppingList->group_id);
    }
}
