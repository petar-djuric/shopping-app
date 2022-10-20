<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ShoppingListFactory extends Factory
{
    public function definition(): array
    {
        return [
            'shopping_list_name' => $this->faker->word(),
        ];
    }
}
