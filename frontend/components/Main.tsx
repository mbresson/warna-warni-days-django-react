import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../common/AuthProvider";
import { logoutFromServer } from "../common/auth";

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
        <button
          className="medium bad-feeling block lg:hidden mt-8 mx-auto"
          onClick={logout}
        >
          Logout
        </button>
      )}
    </>
  );
};

export default Main;
