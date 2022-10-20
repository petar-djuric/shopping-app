import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useDeviceData } from 'react-device-detect';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const device = useDeviceData(window.navigator.userAgent)
    const { login } = useAuth()

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')


    const [emailError, setEmailError] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('')
    const [firstNameError, setFirstNameError] = useState<string>('')
    const [lastNameError, setLastNameError] = useState<string>('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const deviceName = device.browser.name + ' ' + device.os.name

        axios
            .post(process.env.REACT_APP_API_BACKEND_URL + '/api/auth/register', {
                email,
                password,
                // eslint-disable-next-line camelcase
                first_name: firstName,
                // eslint-disable-next-line camelcase
                last_name: lastName,
                // eslint-disable-next-line camelcase
                device_name: deviceName,
            })
            .then((response) => {
                if (response.status === 201) {
                    login(response.data.user, response.data.access_token)
                }
            })
            .catch((e) => {
                if (e.response.status == 422) {
                    if (e.response.data?.errors?.first_name) {
                        setFirstNameError(e.response.data.errors.first_name[0])
                    }

                    if (e.response.data?.errors?.last_name) {
                        setLastNameError(e.response.data.errors.last_name[0])
                    }

                    if (e.response.data?.errors?.email) {
                        setEmailError(e.response.data.errors.email[0])
                    }

                    if (e.response.data?.errors?.password) {
                        setPasswordError(e.response.data.errors.password[0])
                    }
                } else {
                    setEmailError('Unknown Error')
                }
            })
    }
    return (
        <>
            <Container component='main' maxWidth='xs'>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={firstNameError !== ''}
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value)
                                        setFirstNameError('')
                                    }}
                                    helperText={firstNameError}
                                    autoComplete='given-name'
                                    name='firstName'
                                    required
                                    fullWidth
                                    id='firstName'
                                    label='First Name'
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={lastNameError !== ''}
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value)
                                        setLastNameError('')
                                    }}
                                    helperText={lastNameError}
                                    required
                                    fullWidth
                                    id='lastName'
                                    label='Last Name'
                                    name='lastName'
                                    autoComplete='family-name'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={emailError !== ''}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setEmailError('')
                                    }}
                                    helperText={emailError}
                                    required
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    autoComplete='email'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={passwordError !== ''}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setPasswordError('')
                                    }}
                                    helperText={passwordError}
                                    required
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    autoComplete='new-password'
                                />
                            </Grid>
                        </Grid>
                        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                            Register
                        </Button>
                        <Grid container justifyContent='flex-end'>
                            <Grid item>
                                <Link href='/login' variant='body2'>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    )
}
