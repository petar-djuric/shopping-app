import React, { createContext, ReactNode, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserLocalStorage, useTokenLocalStorage } from './useLocalStorage'
import UserInterface from '../interfaces/UserInterface'
import axios from 'axios'

interface AuthContextInterface {
    user: UserInterface | null
    accessToken: string | null
    login: (user: UserInterface, accessToken: string) => void
    updateUser: (user: UserInterface) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextInterface>({
    user: null,
    accessToken: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    login: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    logout: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    updateUser: () => {},
})

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
    const [user, setUser] = useUserLocalStorage('user', null)
    const [accessToken, setAccessToken] = useTokenLocalStorage('access_token', null)

    const navigate = useNavigate()

    const login = (user: UserInterface, accessToken: string): void => {
        setUser(user)
        setAccessToken(accessToken)
        navigate('/', { replace: true })
    }

    const updateUser = (user: UserInterface): void => {
        setUser(user)
    }

    const logout = (): void => {
        axios
            .post(
                'http://127.0.0.1:8000/api/auth/logout',
                {},
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            )
            .then(() => {
                setAccessToken(null)
                setUser(null)
                navigate('/login', { replace: true })
            })
            .catch(() => {
                setAccessToken(null)
                setUser(null)
                navigate('/login', { replace: true })
            })
    }

    const value = useMemo(
        () => ({
            user,
            accessToken,
            login,
            logout,
            updateUser,
        }),
        [user, accessToken],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}
