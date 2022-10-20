<?php

namespace Database\Seeders;

use App\Models\ListItemUnit;
use Illuminate\Database\Seeder;

class ListItemUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $units = [
            [
                'unit_name' => 'kg'
            ],
            [
                'unit_name' => 'g'
            ],
            [
                'unit_name' => 'l'
            ],
            [
                'unit_name' => 'ml'
            ],
            [
                'unit_name' => 'piece'
            ],
            [
                'unit_name' => 'pack'
            ],
            [
                'unit_name' => 'm'
            ],
            [
                'unit_name' => 'cm'
            ],
            [
                'unit_name' => 'm2'
            ],
            [
                'unit_name' => 'cm2'
            ],

        ];

        ListItemUnit::insert($units);
    }
}
