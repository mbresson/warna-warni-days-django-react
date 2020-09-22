
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { get as getCookie } from 'js-cookie'

type AuthStateAuthenticated = {
    state: "authenticated";
    username: string;
    email: string;
}

type AuthStateUnauthenticated = {
    state: "unauthenticated";
}

type AuthStateLoading = {
    state: "loading";
}

type AuthState = AuthStateAuthenticated | AuthStateUnauthenticated | AuthStateLoading

const AuthContext = createContext<AuthState>({
    state: "loading",
})

const PATHS_ACCESSIBLE_TO_UNAUTHENTICATED_USERS = [
    '/login',
    '/signup',
]

const AuthProvider = ({ children }) => {
    const { pathname, events, push } = useRouter()
    const [user, setUser] = useState<AuthState>({ state: "loading" })

    async function getUser() {
        try {
            const response = await fetch('/api/auth/profile/')

            if (response.status == 200) {
                const profile = await response.json()

                setUser({
                    state: "authenticated",
                    username: profile.username,
                    email: profile.email,
                })
            } else {
                throw Error(`Authentication failed: ${response.status}`)
            }
        } catch (err) {
            setUser({ state: "unauthenticated" })
        }
    }

    useEffect(() => {
        getUser()
    }, [pathname])

    useEffect(() => {
        const handleRouteChange = url => {
            if (user.state == "loading") {
                return
            }

            if (!(PATHS_ACCESSIBLE_TO_UNAUTHENTICATED_USERS.includes(url) || user.state == "authenticated")) {
                push('/login')
            }
        }

        handleRouteChange(pathname)

        events.on('routeChangeStart', handleRouteChange)

        return () => {
            events.off('routeChangeStart', handleRouteChange)
        }
    }, [user])

    return (
        <AuthContext.Provider value={{ ...user }}>{children}</AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)

export const loginToServer = async (username: string, password: string): Promise<Boolean> => {
    try {
        const response = await fetch(
            '/api/auth/login/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            })

        return response.status == 200
    } catch {
        return false
    }
}

export const logoutFromServer = async (): Promise<void> => {
    const csrfToken = getCookie('csrftoken')

    await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        }
    })
}

export { AuthProvider, useAuth }