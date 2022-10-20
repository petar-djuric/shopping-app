import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import User from './interfaces/UserInterface'
import { useAuth } from './hooks/useAuth'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import MainPage from './components/pages/MainPage'
import Error from './components/pages/Error'

const ProtectedRoute = ({ user }: { user: User | null }) => {
    if (!user) {
        return <Navigate to={'/login'} replace />
    }

    return <Outlet />
}

function App() {
    const { user } = useAuth()
    return (
        <Routes>
            <Route element={<ProtectedRoute user={user} />}>
                <Route path='/' element={<MainPage />} />
            </Route>

            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />

            <Route path='*' element={<Error />} />
        </Routes>
    )
}

export default App
