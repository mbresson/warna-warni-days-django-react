import Head from 'next/head'
import { useAuth } from '../contexts/auth'
import { get as getCookie } from 'js-cookie'

const logout = async () => {
  const csrfToken = getCookie('csrftoken')

  fetch('/api/auth/logout/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrfToken,
    }
  })
  location.reload()
}

const Index: React.FC<{}> = () => {
  const auth = useAuth()

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-xs m-auto">
        Welcome {JSON.stringify(auth)}!

        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Index