import Head from "next/head";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { loginToServer } from "../utils/auth";

const Login: React.FC<{}> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [queryInProgress, setQueryInProgress] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const onLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setQueryInProgress(true);

    const loginResponse = await loginToServer(username, password);
    setQueryInProgress(false);
    if (loginResponse.state == "succeeded") {
      router.push("/");
    } else {
      setError(loginResponse.error);
    }
  };

  return (
    <>
      <Head>
        <title>Login page </title>
      </Head>

      <form className="form" onSubmit={onLoginFormSubmit}>
        <h2 className="text-3xl text-center mb-4">Welcome!</h2>

        <p className="mb-4">Fill in the form to login with your credentials:</p>

        <div className="md:grid md:grid-cols-2 p-6">
          <div>
            <div className="input-group">
              <label className="input-label" htmlFor="username">
                Username
              </label>

              <input
                className="input-field"
                id="username"
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>

              <input
                className="input-field"
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
        </div>

        {error && <p className="text-red-600 text-xl">{error}</p>}

        <button
          className="form-submit"
          type="submit"
          disabled={queryInProgress}
        >
          {queryInProgress ? "loading..." : "Log me in"}
        </button>

        <p>
          <a
            className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-700"
            href="#"
          >
            Forgot your password? Click here to reset it.
          </a>
        </p>
      </form>

      <footer className="w-full text-center text-md">Hello World!</footer>
    </>
  );
};

export default Login;
