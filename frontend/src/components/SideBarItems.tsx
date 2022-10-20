import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import GroupInterface from '../interfaces/GroupInterface'
import ShoppingListInterface from '../interfaces/ShoppingListInterface'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import { modalStyle } from './shared/styles';

export default function SideBarItems({
    group,
    shoppingLists,
    setShoppingLists,
    setSetSelectedShoppingList,
}: {
    group: GroupInterface | null
    shoppingLists: ShoppingListInterface[] | null
    setShoppingLists: React.Dispatch<React.SetStateAction<ShoppingListInterface[]>>
    setSetSelectedShoppingList: React.Dispatch<React.SetStateAction<number | null>>
}) {
    const { accessToken, user, updateUser } = useAuth()

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        axios
            .post(
                process.env.REACT_APP_API_BACKEND_URL + '/api/lists',
                // eslint-disable-next-line camelcase
                { shopping_list_name: name },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            )
            .then((response) => {
                if (response.status == 201) {
                    if (shoppingLists) {
                        setShoppingLists((shoppingLists) => [...shoppingLists, response.data])
                    } else {
                        setShoppingLists([response.data])
                    }
                    setSetSelectedShoppingList(response.data.id)
                    setNameError('')
                    setName('')
                    handleClose()

                    if(user && user.group_id == null) {
                        // eslint-disable-next-line camelcase
                        user.group_id = response.data.group_id
                        updateUser(user)
                    }
                }
            })
            .catch((e) => {
                if (e.response.status == 422) {
                    if (e.response.data?.errors?.shopping_list_name) {
                        setNameError(e.response.data.errors.shopping_list_name[0])
                    }

                    if (e.response.data?.message) {
                        setNameError(e.response.data.message)
                    }
                } else {
                    setNameError('Could not create a new List')
                }
            })
    }

    return (
        <>
            {(!group || !shoppingLists) && (
                <>
                    <ListItemButton onClick={handleOpen}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary='New List' />
                    </ListItemButton>
                </>
            )}
            {shoppingLists &&
                shoppingLists.map((shoppingList: ShoppingListInterface) => (
                    <ListItemButton
                        key={shoppingList.id}
                        onClick={() => setSetSelectedShoppingList(shoppingList.id)}
                    >
                        <ListItemText primary={shoppingList.shopping_list_name} />
                    </ListItemButton>
                ))}

            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <CssBaseline />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            component='form'
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <Box sx={{ mb: 2, width: '100%' }}>
                                <TextField
                                    error={nameError !== ''}
                                    margin='normal'
                                    required
                                    fullWidth
                                    id='name'
                                    label='Shopping List Name'
                                    name='name'
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        setNameError('')
                                    }}
                                    autoComplete='list_name'
                                    autoFocus
                                    helperText={nameError}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    width: '100%',
                                }}
                            >
                                <Button variant='text' onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    sx={{ ml: 1 }}
                                    disabled={name == ''}
                                >
                                    Create
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
