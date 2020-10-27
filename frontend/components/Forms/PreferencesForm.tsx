import React, { useState } from "react";
import { useAuth, AuthStateAuthenticated } from "common/AuthProvider";
import ErrorsList from "components/ErrorsList";
import PasswordCheckModal from "../Modals/PasswordCheckModal";
import { updateAccount, UpdateAccountChangeset } from "common/apis/account";
import { ApiWeekdays } from "common/apis/responses";

type FormErrors = {
  internalError?: string;
  email?: string[];
  currentPassword?: string;
};

const PreferencesForm: React.FC<{}> = () => {
  const auth = useAuth() as AuthStateAuthenticated;

  const [errors, setErrors] = useState<FormErrors>({});
  const [inProgress, setInProgress] = useState(false);
  const [preferredFirstWeekday, setPreferredFirstWeekday] = useState(
    auth.preferredFirstWeekday
  );
  const [email, setEmail] = useState(auth.email);
  const [checkCurrentPassword, setCheckCurrentPassword] = useState(false);

  const saveChanges = async (currentPassword?: string) => {
    setInProgress(true);

    const changes: UpdateAccountChangeset = {};
    if (email != auth.email) {
      changes.email = email;
    }

    if (preferredFirstWeekday != auth.preferredFirstWeekday) {
      changes.preferred_first_weekday =
        preferredFirstWeekday == "monday"
          ? ApiWeekdays.Monday
          : ApiWeekdays.Sunday;
    }

    const response = await updateAccount(changes, currentPassword);

    setInProgress(false);

    if (response.state == "succeeded") {
      auth.refreshInformation();
    } else {
      setErrors({
        email: response.errors.email,
        internalError: response.errors.other,
        currentPassword: response.errors.current_password,
      });

      if (response.errors.current_password) {
        setCheckCurrentPassword(true);
      }
    }
  };

  const onPreferencesSubmit = (e) => {
    e.preventDefault();

    const passwordConfirmationRequired = email != auth.email;

    if (passwordConfirmationRequired) {
      setCheckCurrentPassword(true);
    } else {
      setErrors({});
      saveChanges();
    }
  };

  const onCurrentPasswordSubmitted = async (currentPassword: string) => {
    setCheckCurrentPassword(false);
    setErrors({});

    saveChanges(currentPassword);
  };

  const touched =
    preferredFirstWeekday != auth.preferredFirstWeekday || email != auth.email;

  return (
    <>
      {checkCurrentPassword ? (
        <PasswordCheckModal
          key="password-check-modal"
          onPasswordSubmitted={onCurrentPasswordSubmitted}
          onCancel={() => setCheckCurrentPassword(false)}
          errors={[errors.currentPassword]}
          warning={
            <p>
              Do you really wish to change your email address to
              <br />
              <strong className="font-mono">{email}</strong>
              <br />?
            </p>
          }
        />
      ) : null}

      <form
        key="preferences-form"
        className="text-center"
        onSubmit={onPreferencesSubmit}
      >
        <div className="choice-group my-4">
          <h4 className="input-label">Preferred first day of the week</h4>

          <button
            className={
              "medium choice " +
              (preferredFirstWeekday == "monday" ? "active" : "")
            }
            onClick={() => {
              setPreferredFirstWeekday("monday");
            }}
            type="button"
          >
            Monday
          </button>

          <button
            className={
              "medium choice " +
              (preferredFirstWeekday == "sunday" ? "active" : "")
            }
            onClick={() => {
              setPreferredFirstWeekday("sunday");
            }}
            type="button"
          >
            Sunday
          </button>
        </div>

        <div className="my-4">
          <label className="input-label" htmlFor="email">
            Email
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

          {email != auth.email && (
            <p className="mixed-feeling text-xl my-4">
              When changing your email address, make sure to type correctly the
              new address, as there won't be any confirmation asked!
            </p>
          )}

          {errors.email && <ErrorsList errors={errors.email} />}
        </div>

        <button
          className="medium mt-10 mb-4 block mx-auto positive-feeling"
          type="submit"
          disabled={inProgress || !touched}
        >
          {inProgress ? "loading..." : "Save changes"}
        </button>

        {errors.internalError && <ErrorsList errors={[errors.internalError]} />}
      </form>
    </>
  );
};

export default PreferencesForm;
