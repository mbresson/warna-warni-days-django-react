
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

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
                console.log('authenticated')
            } else {
                throw Error(`Authentication failed: ${response.status}`)
            }
        } catch (err) {
            console.error(err)
            setUser({ state: "unauthenticated" })
        }
    }

    useEffect(() => {
        console.log("getting user")
        getUser()
    }, [pathname])

    useEffect(() => {
        console.log("new route: ", pathname)

        const handleRouteChange = url => {
            if (user.state == "loading") {
                return
            }

            if (url !== '/login' && user.state != "authenticated") {
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

export { AuthProvider, useAuth }