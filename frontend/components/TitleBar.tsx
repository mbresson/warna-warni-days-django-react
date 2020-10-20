import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "common/AuthProvider";
import { logoutFromServer } from "common/apis/account";

const TitleBar: React.FC<{}> = () => {
  const auth = useAuth();
  const router = useRouter();

  const logout = () => {
    logoutFromServer();
    router.push("/login");
  };

  const loggedIn = auth.state == "authenticated";

  return (
    <header className="p-2 border-b border-gray-300 bg-white">
      <div className="titlebar-inner m-auto px-2 lg:max-w-6xl">
        {loggedIn && (
          <div className="float-right hidden lg:block">
            <Link href="/settings">
              <button className="medium choice mr-2">
                <a>Settings</a>
              </button>
            </Link>

            <button className="bad-feeling medium ml-2" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        <h1
          className={
            "italic text-3xl tracking-tighter text-center" +
            (loggedIn ? " lg:text-left" : "")
          }
        >
          <Link href="/">
            <a>Warna - Warni - Days</a>
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default TitleBar;
