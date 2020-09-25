import "../styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import "whatwg-fetch"; // polyfills window.fetch
import { AuthProvider } from "../utils/AuthProvider";
import Footer from "../components/Footer";
import Main from "../components/Main";
import TitleBar from "../components/TitleBar";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
        <div className="min-h-screen relative pb-24">
          <TitleBar />

          <Main>
            <Component {...pageProps} />
          </Main>

          <Footer />
        </div>
      </AuthProvider>
    </>
  );
};

export default App;
