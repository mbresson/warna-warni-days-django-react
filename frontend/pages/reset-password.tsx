import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import {
  PasswordResetResponse,
  requestPasswordResetFromServer,
} from "common/apis/account";

const ResetPasswordPage: React.FC<{}> = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [queryInProgress, setQueryInProgress] = useState(false);
  const [response, setResponse] = useState<PasswordResetResponse | null>(null);

  const onLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse(null);
    setQueryInProgress(true);

    const response = await requestPasswordResetFromServer(username, email);
    setQueryInProgress(false);
    setResponse(response);
  };

  return (
    <>
      <Head>
        <title>Password reset</title>
      </Head>

      <form className="text-center" onSubmit={onLoginFormSubmit}>
        <h2 className="main-title">Password reset</h2>

        <p className="mb-4">
          Fill in your account's username and email address to reset your
          password.
        </p>

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
            <label className="input-label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {response?.state == "failed" && (
          <p className="bad-feeling text-xl">{response.error}</p>
        )}

        {response?.state == "succeeded" && (
          <p className="positive-feeling text-xl">
            You will receive an email shortly with instructions. Check your spam
            folder if you don't see it.
          </p>
        )}

        {response == null && (
          <button
            className="big mb-2 mt-6 mixed-feeling"
            type="submit"
            disabled={queryInProgress}
          >
            {queryInProgress ? "loading..." : "Reset my password"}
          </button>
        )}

        <div className="mt-6">
          <Link href="/login">
            <a className="font-bold text-xl positive-feeling clickable hover:underline">
              {response != null
                ? "Go back to login page."
                : "I changed my mind, take me back to login page."}
            </a>
          </Link>
        </div>
      </form>
    </>
  );
};

export default ResetPasswordPage;
