import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../utils/AuthProvider";
import { logoutFromServer } from "../utils/auth";

const Main: React.FC<{}> = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();

  const logout = () => {
    logoutFromServer();
    router.push("/login");
  };

  return (
    <main className="mt-10 mx-2 lg:mx-auto lg:max-w-6xl border border-gray-500 bg-white p-6 ">
      {children}

      {auth.state == "authenticated" && (
        <button
          className="medium bad-feeling block lg:hidden mt-8 mx-auto"
          onClick={logout}
        >
          Logout
        </button>
      )}
    </main>
  );
};

export default Main;
