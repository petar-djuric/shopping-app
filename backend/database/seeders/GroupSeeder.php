<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\ShoppingList;
use App\Models\ShoppingListItem;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Group::factory()
            ->count(3)
            ->has(
                ShoppingList::factory()
                    ->count(1)
                    ->has(
                        ShoppingListItem::factory()
                            ->count(10)
                    )
            )
            ->create();
    }
}
