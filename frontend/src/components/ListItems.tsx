import * as React from 'react'
import ShoppingListItemsInterface from '../interfaces/ShoppingListItemsInterface'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import {
    FormControl,
    FormHelperText, Grid,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import ShoppingListInterface from '../interfaces/ShoppingListInterface'
import Typography from '@mui/material/Typography'
import ListItemUnitInterface from '../interfaces/ListItemUnitInterface'
import Button from '@mui/material/Button'
import { useSocket } from '../hooks/socketHock'
import { ListItemEnum } from '../types/Option'

interface PayloadInterface {
    item_name: string
    quantity?: number
    list_item_unit_id?: number
    is_checked?: boolean
}

export default function ListItems({
    shoppingListItems,
    shoppingList,
    listItemUnits,
    setShoppingListItems,
}: {
    shoppingList: ShoppingListInterface
    shoppingListItems: ShoppingListItemsInterface[]
    listItemUnits: ListItemUnitInterface[]
    setShoppingListItems: React.Dispatch<React.SetStateAction<ShoppingListItemsInterface[]>>
}) {
    const { accessToken, user } = useAuth()

    const [newItem, setNewItem] = useState('')
    const [newItemError, setNewItemError] = useState('')

    const [unit, setUnit] = useState<ListItemUnitInterface | null>(null)
    const [quantity, setQuantity] = useState<number | null>(null)

    useSocket({
        accessToken: accessToken ?? '',
        type: ListItemEnum.LIST_ITEM_CREATED,
        roomName: 'group.' + user?.group_id,
        callBack: (data: { shoppingListItem: ShoppingListItemsInterface }) => {
            if (data.shoppingListItem.shopping_list_id == shoppingList.id) {
                setShoppingListItems((items) => [...items, data.shoppingListItem])
            }
        },
    })

    useSocket({
        accessToken: accessToken ?? '',
        type: ListItemEnum.LIST_ITEM_DELETED,
        roomName: 'group.' + user?.group_id,
        callBack: (data: { id: number }) => {
            setShoppingListItems((listItems) =>
                listItems.filter((shoppingListItem) => shoppingListItem.id !== data.id),
            )
        },
    })

    useSocket({
        accessToken: accessToken ?? '',
        type: ListItemEnum.LIST_ITEM_UPDATED,
        roomName: 'group.' + user?.group_id,
        callBack: (data: { shoppingListItem: ShoppingListItemsInterface }) => {
            setShoppingListItems((listItems) =>
                listItems.map((shoppingListItemOld) => {
                    if (shoppingListItemOld.id === data.shoppingListItem.id) {
                        return data.shoppingListItem
                    }
                    return shoppingListItemOld
                }),
            )
        },
    })

    const handleSubmit = () => {
        const payload: PayloadInterface = {
            // eslint-disable-next-line camelcase
            item_name: newItem,
        }

        if (quantity) {
            payload.quantity = quantity
        }

        if (unit) {
            // eslint-disable-next-line camelcase
            payload.list_item_unit_id = unit.id
        }

        axios
            .post(
                process.env.REACT_APP_API_BACKEND_URL + '/api/lists/' + shoppingList.id + '/item',
                // eslint-disable-next-line camelcase
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'X-Socket-ID': window?.Echo?.socketId()  ?? 0,
                    },
                },
            )
            .then((response) => {
                if (response.status == 201) {
                    setShoppingListItems((shoppingListItems) => [
                        ...shoppingListItems,
                        response.data,
                    ])
                    setNewItemError('')
                    setNewItem('')
                    setUnit(null)
                    setQuantity(null)
                }
            })
            .catch((e) => {
                if (e.response.status == 422) {
                    if (e.response.data?.errors?.item_name) {
                        setNewItemError(e.response.data.errors.item_name[0])
                    }

                    if (e.response.data?.errors?.quantity) {
                        setNewItemError(e.response.data.errors.quantity[0])
                    }

                    if (e.response.data?.errors?.list_item_unit_id) {
                        setNewItemError(e.response.data.errors.list_item_unit_id[0])
                    }
                } else {
                    setNewItemError('Could not create a new item')
                }
            })
    }

    const handleDeleteSubmit = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: number,
    ) => {
        event.stopPropagation()
        axios
            .delete(process.env.REACT_APP_API_BACKEND_URL + '/api/lists/' + shoppingList.id + '/item/' + id, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Socket-ID': window?.Echo?.socketId() ?? 0,
                },
            })
            .then((response) => {
                if (response.status == 200) {
                    setShoppingListItems(
                        shoppingListItems.filter((shoppingListItem) => shoppingListItem.id !== id),
                    )
                    setNewItemError('')
                    setNewItem('')
                }
            })
    }

    const handleUpdateSubmit = (shoppingListItem: ShoppingListItemsInterface) => {

        const payload: PayloadInterface = {
            // eslint-disable-next-line camelcase
            item_name: shoppingListItem.item_name,
        }

        if (shoppingListItem.quantity) {
            payload.quantity = shoppingListItem.quantity
        }

        if (shoppingListItem.list_item_unit_id) {
            // eslint-disable-next-line camelcase
            payload.list_item_unit_id = shoppingListItem.list_item_unit_id
        }

        // eslint-disable-next-line camelcase
        payload.is_checked = !shoppingListItem.is_checked

        axios
            .post(
                process.env.REACT_APP_API_BACKEND_URL + '/api/lists/' +
                    shoppingList.id +
                    '/item/' +
                    shoppingListItem.id,
                payload,
                {
                    headers: { Authorization: `Bearer ${accessToken}`,
                        'X-Socket-ID': window?.Echo?.socketId() ?? 0,
                    }
                },
            )
            .then((response) => {
                if (response.status == 200) {
                    setShoppingListItems(
                        shoppingListItems.map((shoppingListItemOld) => {
                            if (shoppingListItemOld.id === shoppingListItem.id) {
                                // eslint-disable-next-line camelcase
                                shoppingListItemOld.is_checked = !shoppingListItem.is_checked
                            }
                            return shoppingListItemOld
                        }),
                    )
                    setNewItemError('')
                    setNewItem('')
                }
            })
    }

    return (
        <>
            <Typography component='h2' variant='h6' color='primary' gutterBottom>
                {shoppingList.shopping_list_name}
            </Typography>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItem
                    key='add-list-item'
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleSubmit()
                        }
                    }}
                >
                    <Grid container spacing={2} columns={8}  direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-end">
                        <Grid item xs={8} sm={5}>
                            <FormControl fullWidth variant='standard'>
                                <InputLabel htmlFor='new-item'>New Item</InputLabel>
                                <Input
                                    id='new-item'
                                    value={newItem}
                                    onChange={(e) => {
                                        setNewItem(e.target.value)
                                        setNewItemError('')
                                    }}
                                    name='add-new-item'
                                    type='string'
                                    startAdornment={
                                        <InputAdornment position='start'>
                                            <AddIcon />
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText id='component-error-text'>{newItemError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} sm={1}>
                            <FormControl variant='standard' fullWidth>
                                <InputLabel htmlFor='quantity'>Quantity</InputLabel>
                                <Input
                                    id='quantity'
                                    value={quantity ?? ''}
                                    onChange={(e) => {
                                        setQuantity(Number(e.target.value))
                                        setNewItemError('')
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Backspace') {
                                            setQuantity(null)
                                            setNewItemError('')
                                        }
                                    }}
                                    name='quantity'
                                    type='number'
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} sm={1}>
                            <FormControl variant='standard' fullWidth>
                                <InputLabel id='demo-simple-select-standard-label'>Unit</InputLabel>
                                <Select
                                    labelId='select'
                                    id='select'
                                    defaultValue={''}
                                    value={unit ? `${unit.id}` : ''}
                                    autoComplete='off'
                                    onChange={(e) => {
                                        setUnit(
                                            listItemUnits.filter(
                                                (listItemUnit) =>
                                                    listItemUnit.id === Number(e.target.value),
                                            )[0],
                                        )
                                        setNewItemError('')
                                    }}
                                    label='unit'
                                >
                                    <MenuItem value=''>
                                        <em>None</em>
                                    </MenuItem>
                                    {listItemUnits.map((listItemUnit) => (
                                        <MenuItem
                                            key={listItemUnit.id}
                                            value={listItemUnit.id}
                                        >
                                            {listItemUnit.unit_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} >
                            <Button fullWidth variant='outlined' onClick={handleSubmit}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>





                </ListItem>
                {shoppingListItems
                    .sort((a, b) => b.id - a.id)
                    .map((shoppingListItem: ShoppingListItemsInterface) => {
                        const labelId = `checkbox-list-label-${shoppingListItem.id}`

                        return (
                            <ListItem
                                key={shoppingListItem.id}
                                secondaryAction={
                                    <IconButton
                                        edge='end'
                                        aria-label='trash'
                                        onClick={(e) => handleDeleteSubmit(e, shoppingListItem.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                disablePadding
                                onClick={() => handleUpdateSubmit(shoppingListItem)}
                            >
                                <ListItemButton dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge='start'
                                            checked={shoppingListItem.is_checked}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        style={{
                                            textDecoration: shoppingListItem.is_checked
                                                ? 'line-through'
                                                : 'none',
                                        }}
                                        id={labelId}
                                        primary={shoppingListItem.item_name}
                                        secondary={
                                            shoppingListItem.quantity &&
                                            shoppingListItem.list_item_unit?.unit_name
                                                ? shoppingListItem.quantity +
                                                  ' ' +
                                                  shoppingListItem.list_item_unit?.unit_name
                                                : ''
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
            </List>
        </>
    )
}
