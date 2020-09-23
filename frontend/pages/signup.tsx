import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { signUpToServer } from "../utils/auth";

type SignupErrors = {
  username?: string[];
  email?: string[];
  password?: string[];
  passwordConfirmation?: string[];
  internalError?: string;
};

const Signup: React.FC<{}> = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [queryInProgress, setQueryInProgress] = useState(false);

  const router = useRouter();

  const passwordConfirmationIsCorrect = (): boolean => {
    if (password != passwordConfirmation) {
      setErrors({
        ...errors,
        passwordConfirmation: ["Passwords do not match."],
      });
      return false;
    }

    return true;
  };

  const onSignupFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordConfirmationIsCorrect()) {
      return;
    }

    setQueryInProgress(true);
    setErrors({});

    const signUpResponse = await signUpToServer(username, password, email);
    setQueryInProgress(false);
    if (signUpResponse.state == "succeeded") {
      router.push("/");
    } else {
      setErrors(signUpResponse.errors);
    }
  };

  return (
    <>
      <Head>
        <title>Signup page </title>
      </Head>

      <form className="form" onSubmit={onSignupFormSubmit}>
        <h2 className="text-3xl text-center mb-4">Welcome!</h2>

        <p className="mb-4">Fill in the form to create your account:</p>

        <div className="md:grid md:grid-cols-2 p-6">
          <div>
            <div className="input-group">
              <label className="input-label" htmlFor="username">
                Username
              </label>

              <input
                className={"input-field " + (errors.username ? "invalid" : "")}
                id="username"
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              {errors.username && (
                <p className="input-error">{errors.username}</p>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email<sup className="font-bold">1</sup>
              </label>

              <input
                className={"input-field " + (errors.email ? "invalid" : "")}
                id="email"
                type="email"
                placeholder="your@email.com"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {errors.email && <p className="input-error">{errors.email}</p>}
            </div>
          </div>

          <div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>

              <input
                className={"input-field " + (errors.password ? "invalid" : "")}
                id="password"
                type="password"
                placeholder="***"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {errors.password && (
                <p className="input-error">{errors.password}</p>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password2">
                Password (repeat)
              </label>

              <input
                className={
                  "input-field " +
                  (errors.passwordConfirmation ? "invalid" : "")
                }
                id="password2"
                type="password"
                placeholder="***"
                name="password2"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />

              {errors.passwordConfirmation && (
                <p className="input-error">{errors.passwordConfirmation}</p>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm">
          <sup className="font-bold">1</sup> Your email will only be used in
          case you forget your password and will not be shared with any third
          party.
        </p>

        {errors.internalError && (
          <p className="text-red-600 text-xl my-8">{errors.internalError}</p>
        )}

        {!errors.internalError && (
          <button
            className="form-submit"
            type="submit"
            disabled={queryInProgress}
          >
            {queryInProgress ? "loading..." : "Sign me up!"}
          </button>
        )}
      </form>

      <footer className="w-full text-center text-md">Hello World!</footer>
    </>
  );
};

export default Signup;
