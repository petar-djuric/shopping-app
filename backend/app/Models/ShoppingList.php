<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\ShoppingList
 *
 * @property int $id
 * @property string $shopping_list_name
 * @property int $group_id
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\ShoppingListItem[] $shoppingListItem
 * @property-read int|null $shopping_list_item_count
 * @method static \Database\Factories\ShoppingListFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingList newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingList newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingList query()
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingList whereGroupId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingList whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingList whereShoppingListName($value)
 * @mixin \Eloquent
 */
class ShoppingList extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    public $timestamps = false;

    public function shoppingListItems(): HasMany
    {
        return $this->hasMany(ShoppingListItem::class);
    }
}
