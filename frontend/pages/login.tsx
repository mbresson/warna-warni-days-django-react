import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { loginToServer } from '../utils/auth'

const Login: React.FC<{}> = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const onLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const successfullyLoggedIn = await loginToServer(username, password)
        if (successfullyLoggedIn) {
            router.push('/')
        }
    }

    return (
        <>
            <Head>
                <title>Login page </title>
            </Head>

            <div className="w-full max-w-xs m-auto">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onLoginFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>

                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" name="username" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>

                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <p className="text-red-500 text-xs italic">Please choose a password.</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Sign In
                        </button>

                        <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                            Forgot Password?
                        </a>
                    </div>
                </form>
            </div>

            <footer className="w-full text-center text-md">
                Hello World!
            </footer>
        </>
    )
}

export default Login