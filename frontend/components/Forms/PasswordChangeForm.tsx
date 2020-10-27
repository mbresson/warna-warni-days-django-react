import React, { useState } from "react";
import PasswordCheckModal from "../Modals/PasswordCheckModal";
import { updateAccount } from "common/apis/account";
import ErrorsList from "components/ErrorsList";

enum FormState {
  Unsubmitted,
  InProgress,
  Successful,
}

type FormErrors = {
  internalError?: string;
  newPassword?: string[];
  newPasswordConfirmation?: string[];
  currentPassword?: string;
};

const PasswordChangeForm: React.FC<{}> = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [checkCurrentPassword, setCheckCurrentPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>(FormState.Unsubmitted);

  const passwordConfirmationIsCorrect = (): boolean => {
    if (newPassword != newPasswordConfirmation) {
      setErrors({
        ...errors,
        newPasswordConfirmation: ["Passwords do not match."],
      });
      return false;
    }

    return true;
  };

  const onCurrentPasswordSubmitted = async (currentPassword: string) => {
    setCheckCurrentPassword(false);
    setFormState(FormState.InProgress);

    const response = await updateAccount(
      { password: newPassword },
      currentPassword
    );

    if (response.state == "succeeded") {
      setFormState(FormState.Successful);
      return;
    }

    setFormState(FormState.Unsubmitted);

    setErrors({
      newPassword: response.errors.password,
      internalError: response.errors.other,
      currentPassword: response.errors.current_password,
    });

    if (response.errors.current_password) {
      setCheckCurrentPassword(true);
    }
  };

  if (formState == FormState.Successful) {
    return (
      <h2 className="positive-feeling text-2xl text-center my-8">
        Your password was successfully changed!
      </h2>
    );
  }

  const inProgress = formState == FormState.InProgress;

  return (
    <>
      {checkCurrentPassword ? (
        <PasswordCheckModal
          key="password-check-modal"
          onPasswordSubmitted={onCurrentPasswordSubmitted}
          onCancel={() => setCheckCurrentPassword(false)}
          errors={[errors.currentPassword]}
        />
      ) : null}

      <form
        className="text-center"
        key="password-change-form"
        onSubmit={(e) => {
          e.preventDefault();

          if (!passwordConfirmationIsCorrect()) {
            return;
          }

          setErrors({});
          setCheckCurrentPassword(true);
        }}
      >
        <div className="md:grid md:grid-cols-2">
          <div>
            <label className="input-label" htmlFor="new_password">
              New password
            </label>

            <input
              id="new_password"
              type="password"
              placeholder="***"
              name="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            {errors.newPassword && <ErrorsList errors={errors.newPassword} />}
          </div>

          <div>
            <label className="input-label" htmlFor="new_password_confirmation">
              New password (repeat)
            </label>

            <input
              id="new_password_confirmation"
              type="password"
              placeholder="***"
              name="new_password_confirmation"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              required
            />

            {errors.newPasswordConfirmation && (
              <ErrorsList errors={errors.newPasswordConfirmation} />
            )}
          </div>

          {errors.internalError && (
            <ErrorsList errors={[errors.internalError]} />
          )}
        </div>

        <button
          className="medium mt-10 mb-4 mixed-feeling"
          type="submit"
          disabled={inProgress}
        >
          {inProgress ? "loading..." : "Change my password"}
        </button>
      </form>
    </>
  );
};

export default PasswordChangeForm;
