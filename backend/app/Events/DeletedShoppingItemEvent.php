<?php

namespace App\Events;

use App\Models\ShoppingList;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeletedShoppingItemEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $id;
    public ShoppingList $shoppingList;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($id, $shoppingList)
    {
        $this->id = $id;
        $this->shoppingList = $shoppingList;
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->id];
    }

    public function broadcastAs(): string
    {
        return 'shopping-list.item.deleted';
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('group.' . $this->shoppingList->group_id);
    }
}
