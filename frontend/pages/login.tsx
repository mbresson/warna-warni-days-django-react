import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AuthStateUnauthenticated, useAuth } from "common/AuthProvider";
import { loginToServer } from "common/apis/account";

const Login: React.FC<{}> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [queryInProgress, setQueryInProgress] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const auth = useAuth() as AuthStateUnauthenticated;

  const onLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setQueryInProgress(true);

    const loginResponse = await loginToServer(username, password);

    if (loginResponse.state == "succeeded") {
      await auth.refreshInformation();
      router.push("/");
    } else {
      setError(loginResponse.error);
    }

    setQueryInProgress(false);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <form className="text-center" onSubmit={onLoginFormSubmit}>
        <h2 className="main-title">Welcome back!</h2>

        <p className="mb-4">Fill in the form to login with your credentials.</p>

        <Link href="/reset-password">
          <a className="ml-4 font-bold mixed-feeling clickable hover:underline">
            (forgot your password? Click here to reset it)
          </a>
        </Link>

        <div className="md:grid md:grid-cols-2 p-6">
          <div>
            <label className="input-label" htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="***"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="bad-feeling text-xl">{error}</p>}

        <button
          className="big mb-2 mt-6 positive-feeling"
          type="submit"
          disabled={queryInProgress}
        >
          {queryInProgress ? "loading..." : "Log me in"}
        </button>

        <div className="mt-6">
          <Link href="/signup">
            <a className="font-bold text-xl positive-feeling clickable hover:underline">
              No account? Click here to create one.
            </a>
          </Link>
        </div>
      </form>
    </>
  );
};

export default Login;
