import '../styles/globals.css'
import { AppProps } from 'next/app'
import 'whatwg-fetch' // polyfills window.fetch
import { AuthProvider } from '../contexts/auth'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div className="h-screen bg-gradient-to-tr from-blue-200 to-orange-200">
      <main className="p-4 shadow rounded bg-white mb-20" >
        <h1 className="italic text-center text-4xl">Warna - Warni - Days!</h1>
      </main>

      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  )
}

export default App
