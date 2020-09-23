import "../styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import "whatwg-fetch"; // polyfills window.fetch
import { AuthProvider } from "../utils/AuthProvider";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <main className="p-2 border border-gray-500 bg-white md:mb-20">
          <h1 className="italic text-center text-3xl tracking-tighter">
            Warna - Warni - Days
          </h1>
        </main>

        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </div>
    </>
  );
};

export default App;
