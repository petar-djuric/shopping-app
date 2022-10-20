import * as React from 'react'
import { styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SideBarItems from '../SideBarItems'
import ListItems from '../ListItems'
import { useEffect, useState } from 'react'
import { grey } from '@mui/material/colors'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth'
import GroupInterface from '../../interfaces/GroupInterface'
import ShoppingListInterface from '../../interfaces/ShoppingListInterface'
import ShoppingListItemsInterface from '../../interfaces/ShoppingListItemsInterface'
import ListItemUnitInterface from '../../interfaces/ListItemUnitInterface'
import Avatar from '@mui/material/Avatar'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { modalStyle } from '../shared/styles'
import { Alert, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import { Logout } from '@mui/icons-material'

const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                display: 'none',
            }),
        },
    }),
)

export default function MainPage() {
    const { accessToken, user, logout, updateUser } = useAuth()

    const [open, setOpen] = useState<boolean>(true)
    const toggleDrawer = () => {
        setOpen(!open)
    }

    const [group, setGroup] = useState<GroupInterface | null>(null)
    const [shoppingLists, setShoppingLists] = useState<ShoppingListInterface[]>([])
    const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItemsInterface[]>([])
    const [listItemUnits, setListItemUnits] = useState<ListItemUnitInterface[]>([])
    const [selectedShoppingList, setSetSelectedShoppingList] = useState<number | null>(null)

    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => {
        setOpenModal(false)
        setUserEmail('')
        setUserEmailError('')
        setUserEmailSuccess('')
    }

    const [userEmail, setUserEmail] = useState('')
    const [userEmailError, setUserEmailError] = useState('')
    const [userEmailSuccess, setUserEmailSuccess] = useState('')

    const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState<null | HTMLElement>(null)
    const accountMenuOpen = Boolean(accountMenuAnchorEl)
    const handleAccountMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAccountMenuAnchorEl(event.currentTarget)
    }
    const handleAccountMenuClose = () => {
        setAccountMenuAnchorEl(null)
    }

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_API_BACKEND_URL + '/api/lists', {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
                if (!response.data) {
                    setGroup(null)
                    setShoppingLists([])
                } else {
                    setGroup({ id: response.data.id, name: response.data.group_name })
                    setShoppingLists(response.data.shopping_lists)
                    if (response.data.shopping_lists) {
                        setSetSelectedShoppingList(response.data.shopping_lists[0].id)
                    }

                    if(user && user.group_id == null) {
                        // eslint-disable-next-line camelcase
                        user.group_id = response.data.id
                        updateUser(user)
                    }
                }
            })

        axios
            .get(process.env.REACT_APP_API_BACKEND_URL + '/api/listsItemUnit', {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
                if (response.status == 200) {
                    setListItemUnits(response.data)
                }
            })
    }, [])

    useEffect(() => {
        if (selectedShoppingList) {
            axios
                .get(process.env.REACT_APP_API_BACKEND_URL + '/api/lists/' + selectedShoppingList, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((response) => {
                    if (!response.data) {
                        setShoppingListItems([])
                    } else {
                        setShoppingListItems(response.data)
                    }
                })
        }
    }, [selectedShoppingList])

    const handleModalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (user) {
            axios
                .post(
                    process.env.REACT_APP_API_BACKEND_URL + '/api/group/' + user?.group_id,
                    // eslint-disable-next-line camelcase
                    { email: userEmail },
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    },
                )
                .then((response) => {
                    setUserEmailSuccess(response.data.message)
                })
                .catch((e) => {
                    if (e.response.status == 422) {
                        if (e.response.data?.errors?.email) {
                            setUserEmailError(e.response.data.errors.email[0])
                        }
                    } else {
                        setUserEmailError('Could not add user')
                    }
                })
        } else {
            setUserEmailError('Unable to add user')
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position='absolute' open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px',
                        }}
                    >
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}></Box>

                        <IconButton onClick={handleOpenModal}>
                            <PersonAddIcon style={{ fill: '#ffffff' }} />
                        </IconButton>
                        <Tooltip disableFocusListener title='Account'>
                            <IconButton
                                onClick={handleAccountMenuClick}
                                size='small'
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                    {' '}
                                    {user ? user.first_name[0] + user.last_name[0] : ''}{' '}
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={accountMenuAnchorEl}
                            id='account-menu'
                            open={accountMenuOpen}
                            onClose={handleAccountMenuClose}
                            onClick={handleAccountMenuClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <Logout fontSize='small' />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Drawer variant='permanent' open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component='nav'>
                        <SideBarItems
                            group={group}
                            shoppingLists={shoppingLists}
                            setShoppingLists={setShoppingLists}
                            setSetSelectedShoppingList={setSetSelectedShoppingList}
                        />
                        <Divider sx={{ my: 1 }} />
                    </List>
                </Drawer>
                <Box
                    component='main'
                    sx={{
                        backgroundColor: grey[100],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    {shoppingLists &&
                                        shoppingLists.map((shoppingList) => {
                                            if (shoppingList.id === selectedShoppingList) {
                                                return (
                                                    <ListItems
                                                        key={shoppingList.id}
                                                        shoppingListItems={shoppingListItems}
                                                        shoppingList={shoppingList}
                                                        listItemUnits={listItemUnits}
                                                        setShoppingListItems={setShoppingListItems}
                                                    />
                                                )
                                            }
                                        })}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
            >
                <Fade in={openModal}>
                    <Box sx={modalStyle}>
                        <CssBaseline />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            component='form'
                            onSubmit={handleModalSubmit}
                            noValidate
                        >
                            <Box sx={{ mb: 2, width: '100%' }}>
                                <TextField
                                    error={userEmailError !== ''}
                                    margin='normal'
                                    required
                                    fullWidth
                                    id='email'
                                    label='User email to add to group'
                                    name='email'
                                    value={userEmail}
                                    onChange={(e) => {
                                        setUserEmail(e.target.value)
                                        setUserEmailError('')
                                    }}
                                    autoFocus
                                    helperText={userEmailError}
                                />
                            </Box>
                            <Box sx={{ mb: 2, width: '100%' }}>
                                {userEmailSuccess !== '' && (
                                    <Alert severity='success'>{userEmailSuccess}</Alert>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    width: '100%',
                                }}
                            >
                                <Button variant='text' onClick={handleCloseModal}>
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    sx={{ ml: 1 }}
                                    disabled={userEmail == '' || userEmailSuccess !== ''}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
