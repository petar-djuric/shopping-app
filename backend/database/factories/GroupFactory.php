<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    public function definition(): array
    {
        return [
            'group_name' => $this->faker->word(),
        ];
    }

    public function configure(): GroupFactory
    {
        return $this->afterCreating(function (Group $group) {
            User::whereNull('group_id')->limit(5)->get()->each(fn($u) => $u->update(['group_id' => $group->id]));
        });
    }
}
