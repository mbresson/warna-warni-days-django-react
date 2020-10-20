import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "common/AuthProvider";
import { logoutFromServer } from "common/apis/account";

const Main: React.FC<{}> = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();

  const logout = () => {
    logoutFromServer();
    router.push("/login");
  };

  return (
    <>
      <main className="mt-10 mx-1 sm:mx-2 lg:mx-auto lg:max-w-6xl border border-gray-500 bg-white p-1 sm:p-6 ">
        {children}
      </main>

      {auth.state == "authenticated" && (
        <div className="text-center lg:hidden mt-8 my-2">
          <Link href="/settings">
            <button className="big choice mr-2">
              <a>Settings</a>
            </button>
          </Link>

          <button className="big bad-feeling ml-2" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Main;
