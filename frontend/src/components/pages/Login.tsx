import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useState } from 'react'
import axios from 'axios'
import { useDeviceData } from 'react-device-detect'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
    const device = useDeviceData(window.navigator.userAgent)
    const { login } = useAuth()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [emailError, setEmailError] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const deviceName = device.browser.name + ' ' + device.os.name

        axios
            .post(process.env.REACT_APP_API_BACKEND_URL + '/api/auth/login', {
                email,
                password,
                // eslint-disable-next-line camelcase
                device_name: deviceName,
            })
            .then((response) => {
                if (response.status === 200) {
                    login(response.data.user, response.data.access_token)
                }
            })
            .catch((e) => {
                if (e.response.status == 422) {
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
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        error={emailError !== ''}
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setEmailError('')
                        }}
                        autoComplete='email'
                        autoFocus
                        helperText={emailError}
                    />
                    <TextField
                        error={passwordError !== ''}
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        value={password}
                        helperText={passwordError}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordError('')
                        }}
                        autoComplete='current-password'
                    />
                    <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                        Login
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href='/register' variant='body2'>
                                {'Don\'t have an account? Sign Up'}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}
