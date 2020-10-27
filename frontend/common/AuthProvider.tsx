import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export type AuthStateAuthenticated = {
  state: "authenticated";
  username: string;
  email: string;
  dateJoined: Date;
  preferredFirstWeekday: "sunday" | "monday";
  refreshInformation: () => void;
};

export type AuthStateUnauthenticated = {
  state: "unauthenticated";
};

export type AuthStateLoading = {
  state: "loading";
};

export type AuthState =
  | AuthStateAuthenticated
  | AuthStateUnauthenticated
  | AuthStateLoading;

const AuthContext = createContext<AuthState>({
  state: "loading",
});

const PATHS_ACCESSIBLE_TO_UNAUTHENTICATED_USERS = [
  "/login",
  "/signup",
  "/reset-password",
];

export const AuthProvider = ({ children }) => {
  const { pathname, events, push } = useRouter();
  const [user, setUser] = useState<AuthState>({ state: "loading" });

  async function getUser() {
    try {
      const response = await fetch("/api/auth/account/");

      if (response.status == 200) {
        const profile = await response.json();

        setUser({
          state: "authenticated",
          username: profile.username,
          email: profile.email,
          dateJoined: new Date(profile.date_joined),
          preferredFirstWeekday: { S: "sunday", M: "monday" }[
            profile.preferred_first_weekday
          ],
          refreshInformation: getUser,
        });
      } else {
        throw Error(`Authentication failed: ${response.status}`);
      }
    } catch (err) {
      setUser({ state: "unauthenticated" });
    }
  }

  useEffect(() => {
    getUser();
  }, [pathname]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (user.state == "loading") {
        return;
      }

      if (
        !(
          PATHS_ACCESSIBLE_TO_UNAUTHENTICATED_USERS.includes(url) ||
          user.state == "authenticated"
        )
      ) {
        push("/login");
      }
    };

    handleRouteChange(pathname);

    events.on("routeChangeStart", handleRouteChange);

    return () => {
      events.off("routeChangeStart", handleRouteChange);
    };
  }, [user]);

  if (user.state == "loading") {
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
