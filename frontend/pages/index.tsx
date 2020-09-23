import Head from "next/head";
import { useAuth } from "../utils/AuthProvider";
import { logoutFromServer } from "../utils/auth";
import { useRouter } from "next/router";

const Index: React.FC<{}> = () => {
  const auth = useAuth();
  const router = useRouter();

  const logout = () => {
    logoutFromServer();
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <div className="w-full max-w-xs m-auto">
        Welcome {JSON.stringify(auth)}!
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Index;
