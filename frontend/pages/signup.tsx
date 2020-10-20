import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { signUpToServer } from "common/apis/account";
import ErrorsList from "components/ErrorsList";

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
        <title>Sign up</title>
      </Head>

      <form className="text-center" onSubmit={onSignupFormSubmit}>
        <h2 className="main-title">Welcome!</h2>

        <p className="mb-4">Fill in the form to create your account.</p>

        <div className="md:grid md:grid-cols-2 p-6">
          <div>
            <label className="input-label" htmlFor="username">
              Username
            </label>

            <input
              className={errors.username ? "bad-feeling" : ""}
              id="username"
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {errors.username && <ErrorsList errors={errors.username} />}
          </div>

          <div>
            <label className="input-label" htmlFor="email">
              Email<sup className="font-bold">1</sup>
            </label>

            <input
              className={errors.email ? "bad-feeling" : ""}
              id="email"
              type="email"
              placeholder="your@email.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {errors.email && <ErrorsList errors={errors.email} />}
          </div>

          <div>
            <label className="input-label" htmlFor="password">
              Password
            </label>

            <input
              className={errors.password ? "bad-feeling" : ""}
              id="password"
              type="password"
              placeholder="***"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errors.password && <ErrorsList errors={errors.password} />}
          </div>

          <div>
            <label className="input-label" htmlFor="password2">
              Password (repeat)
            </label>

            <input
              className={errors.passwordConfirmation ? "bad-feeling" : ""}
              id="password2"
              type="password"
              placeholder="***"
              name="password2"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />

            {errors.passwordConfirmation && (
              <ErrorsList errors={errors.passwordConfirmation} />
            )}
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
            className="big mb-2 mt-6 positive-feeling"
            type="submit"
            disabled={queryInProgress}
          >
            {queryInProgress ? "loading..." : "Sign me up!"}
          </button>
        )}

        <div className="mt-6">
          <Link href="/login">
            <a className="font-bold text-xl positive-feeling clickable hover:underline">
              Already have an account? Click here to log in.
            </a>
          </Link>
        </div>
      </form>
    </>
  );
};

export default Signup;
