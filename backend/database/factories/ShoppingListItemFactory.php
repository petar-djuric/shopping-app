<?php

namespace Database\Factories;

use App\Models\ListItemUnit;
use App\Models\ShoppingListItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShoppingListItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'item_name' => $this->faker->sentence()
        ];
    }

    public function configure(): ShoppingListItemFactory
    {
        $units = ListItemUnit::all();

        return $this->afterCreating(function (ShoppingListItem $shoppingListItem) use ($units) {
            if(rand(0, 1)) {
                $shoppingListItem->update([
                    'list_item_unit_id' => $units->random(1)->first()->id,
                    'quantity' => rand(1, 200),
                ]);
            }

            if(rand(0, 1)) {
                $shoppingListItem->update([
                   'is_checked' => true
                ]);
            }
        });
    }
}
