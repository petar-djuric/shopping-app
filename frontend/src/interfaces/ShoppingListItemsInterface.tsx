import ListItemUnitInterface from './ListItemUnitInterface';

export default interface ShoppingListItemsInterface {
    id: number,
    item_name: string,
    shopping_list_id: number,
    quantity: number | null,
    list_item_unit_id: number | null,
    list_item_unit: ListItemUnitInterface | null
    is_checked: boolean,
}
