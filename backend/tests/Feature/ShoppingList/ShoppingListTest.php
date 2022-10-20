<?php

namespace Tests\Feature\ShoppingList;


use App\Models\ListItemUnit;
use App\Models\ShoppingList;
use App\Models\ShoppingListItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShoppingListTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_group_get_shopping_list()
    {
        $this->seed();

        Sanctum::actingAs(User::whereNotNull('group_id')->first());

        $response = $this->get('api/lists');
        $response->assertStatus(200);

        $responseArray = $response->json();

        $this->assertArrayHasKey('id', $responseArray);
        $this->assertArrayHasKey('group_name', $responseArray);
        $this->assertArrayHasKey('shopping_lists', $responseArray);
        $this->assertArrayHasKey('id', $responseArray['shopping_lists'][0]);
        $this->assertArrayHasKey('shopping_list_name', $responseArray['shopping_lists'][0]);
        $this->assertArrayHasKey('group_id', $responseArray['shopping_lists'][0]);
    }

    public function test_user_with_group_get_shopping_list_items()
    {
        $this->seed();

        $user = User::whereNotNull('group_id')->first();
        Sanctum::actingAs($user);

        $shoppingListId = ShoppingList::firstWhere('group_id', $user->group_id)->id;

        $response = $this->get('api/lists/' . $shoppingListId);
        $response->assertStatus(200);

        $response->assertJsonCount(10);

        $responseArrayListFirst = $response->json()[0];

        $this->assertArrayHasKey("id", $responseArrayListFirst);
        $this->assertArrayHasKey("item_name", $responseArrayListFirst);
        $this->assertArrayHasKey("shopping_list_id", $responseArrayListFirst);
        $this->assertArrayHasKey("quantity", $responseArrayListFirst);
        $this->assertArrayHasKey("list_item_unit_id", $responseArrayListFirst);
        $this->assertArrayHasKey("is_checked", $responseArrayListFirst);
        $this->assertArrayHasKey("list_item_unit", $responseArrayListFirst);

    }

    public function test_user_with_group_create_shopping_list_item_validation_error()
    {
        $this->seed();

        $user = User::whereNotNull('group_id')->first();
        Sanctum::actingAs($user);

        $shoppingListId = ShoppingList::firstWhere('group_id', $user->group_id)->id;

        $response = $this->postJson('api/lists/' . $shoppingListId . '/item');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('item_name');
    }

    public function test_user_with_group_create_shopping_list_item()
    {
        $this->seed();

        $user = User::whereNotNull('group_id')->first();
        Sanctum::actingAs($user);

        $shoppingListId = ShoppingList::firstWhere('group_id', $user->group_id)->id;

        $response = $this->postJson('api/lists/' . $shoppingListId . '/item', [
            'item_name' => 'item_name_test'
        ]);

        $response->assertStatus(201);

        $responseItem = $response->json();

        $this->assertArrayHasKey("id", $responseItem);
        $this->assertArrayHasKey("item_name", $responseItem);
        $this->assertArrayHasKey("shopping_list_id", $responseItem);
        $this->assertArrayHasKey("quantity", $responseItem);
        $this->assertArrayHasKey("list_item_unit_id", $responseItem);
        $this->assertArrayHasKey("is_checked", $responseItem);
        $this->assertArrayHasKey("list_item_unit", $responseItem);

        $this->assertSame(null, $responseItem['quantity']);
        $this->assertSame(null, $responseItem['list_item_unit_id']);

        $response = $this->get('api/lists/' . $shoppingListId);
        $response->assertStatus(200);

        $response->assertJsonCount(11);


        $response = $this->postJson('api/lists/' . $shoppingListId . '/item', [
            'item_name' => 'item_name_test',
            'quantity' => 20
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('list_item_unit_id');

        $unitId = ListItemUnit::first()->id;

        $response = $this->postJson('api/lists/' . $shoppingListId . '/item', [
            'item_name' => 'item_name_test',
            'quantity' => 20,
            'list_item_unit_id' => $unitId,
        ]);

        $response->assertStatus(201);

        $responseItem = $response->json();

        $this->assertArrayHasKey("quantity", $responseItem);
        $this->assertArrayHasKey("list_item_unit_id", $responseItem);

        $this->assertSame(20, $responseItem['quantity']);
        $this->assertSame($unitId, $responseItem['list_item_unit_id']);

        $response = $this->get('api/lists/' . $shoppingListId);
        $response->assertStatus(200);

        $response->assertJsonCount(12);
    }

    public function test_user_with_group_delete_shopping_list_item()
    {
        $this->seed();

        $user = User::whereNotNull('group_id')->first();
        Sanctum::actingAs($user);

        $shoppingListId = ShoppingList::firstWhere('group_id', $user->group_id)->id;
        $itemId = ShoppingListItem::firstWhere('shopping_list_id', $shoppingListId)->id;

        $response = $this->delete('api/lists/' . $shoppingListId . '/item/' . $itemId);
        $response->assertStatus(200);

        $this->assertSame('List item deleted', $response->json( 'message'));

        $response = $this->get('api/lists/' . $shoppingListId);
        $response->assertStatus(200);

        $response->assertJsonCount(9);
    }

    public function test_user_without_group_can_join_only_one_group()
    {
        $this->seed();
        $user = User::whereNull('group_id')->first();
        Sanctum::actingAs($user);

        $response = $this->get('api/lists');
        $response->assertStatus(200);

        $responseArray = $response->json();

        $this->assertSame([], $responseArray);

        $response = $this->postJson('api/lists');

        $response->assertJsonValidationErrorFor('shopping_list_name');

        $response = $this->postJson('api/lists', [
            'shopping_list_name' => 'new_list_name'
        ]);

        $response->assertStatus(201);


        $responseData = $response->json();

        $this->assertArrayHasKey("id", $responseData);
        $this->assertArrayHasKey("shopping_list_name", $responseData);
        $this->assertArrayHasKey("group_id", $responseData);

        $shoppingListId = ShoppingList::firstWhere('group_id', $user->group_id)->id;

        $response = $this->get('api/lists/' . $shoppingListId);
        $response->assertStatus(200);

        $response->assertJsonCount(0);
    }

    public function test_user_with_group_validation_error_creating_second_list()
    {
        $this->seed();

        Sanctum::actingAs(User::whereNotNull('group_id')->first());

        $response = $this->postJson('api/lists', [
            'shopping_list_name' => 'new_list_name'
        ]);

        $response->assertStatus(400);


        $this->assertSame('Creating a new shopping list is not allowed', $response->json('message'));
    }
}
