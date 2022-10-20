<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\ShoppingListItem
 *
 * @property int $id
 * @property string $item_name
 * @property int $shopping_list_id
 * @property string|null $quantity
 * @property int|null $list_item_unit_id
 * @property bool $is_checked
 * @property-read \App\Models\ShoppingList|null $listItemUnit
 * @property-read \App\Models\ShoppingList $shoppingList
 * @method static \Database\Factories\ShoppingListItemFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem whereIsChecked($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem whereItemName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem whereListItemUnitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShoppingListItem whereShoppingListId($value)
 * @mixin \Eloquent
 */
class ShoppingListItem extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    public $timestamps = false;
    protected $casts = [
        'is_checked' => 'boolean',
    ];
    public function shoppingList(): BelongsTo
    {
        return $this->belongsTo(ShoppingList::class);
    }

    public function listItemUnit(): BelongsTo
    {
        return $this->belongsTo(ListItemUnit::class);
    }
}
