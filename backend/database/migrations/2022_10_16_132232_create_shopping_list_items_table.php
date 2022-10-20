<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShoppingListItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shopping_list_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');
            $table->foreignId('shopping_list_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedDecimal('quantity')->nullable();
            $table->foreignId('list_item_unit_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->boolean('is_checked')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shopping_list_items');
    }
}
