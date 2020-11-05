import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export type AuthStateAuthenticated = {
  state: "authenticated";
  username: string;
  email: string;
  dateJoined: Date;
  preferredFirstWeekday: "sunday" | "monday";
  refreshInformation: () => Promise<void>;
};

export type AuthStateUnauthenticated = {
  state: "unauthenticated";
  refreshInformation: () => Promise<void>;
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

const PUBLIC_PAGES_PATHS = ["/login", "/signup", "/reset-password"];

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
      setUser({
        state: "unauthenticated",
        refreshInformation: getUser,
      });
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

      const isPublicPage = PUBLIC_PAGES_PATHS.includes(url);

      if (user.state == "authenticated" && isPublicPage) {
        push("/");
      } else if (user.state == "unauthenticated" && !isPublicPage) {
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
