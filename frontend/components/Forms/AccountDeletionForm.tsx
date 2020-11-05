import { useRouter } from "next/router";
import React, { useState } from "react";
import PasswordCheckModal from "../Modals/PasswordCheckModal";
import { AuthStateAuthenticated, useAuth } from "common/AuthProvider";
import { deleteAccountFromServer } from "common/apis/account";
import ErrorsList from "components/ErrorsList";

type FormErrors = {
  currentPassword?: string;
  internalError?: string;
};

const AccountDeletionForm: React.FC<{}> = () => {
  const [checkCurrentPassword, setCheckCurrentPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [inProgress, setInProgress] = useState(false);
  const router = useRouter();
  const auth = useAuth() as AuthStateAuthenticated;

  const onCurrentPasswordSubmitted = async (currentPassword: string) => {
    setCheckCurrentPassword(false);
    setInProgress(true);
    setErrors({});

    const response = await deleteAccountFromServer(currentPassword);

    if (response.state == "succeeded") {
      alert("Your account was successfully deleted. Have a nice day!");
      await auth.refreshInformation();
      router.push("/login");
    } else {
      setInProgress(false);

      setErrors({
        currentPassword: response.errors.current_password,
        internalError: response.errors.other,
      });

      if (response.errors.current_password) {
        setCheckCurrentPassword(true);
      }
    }
  };

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

      <div key="account-deletion-form">
        <button
          className="medium bad-feeling block m-auto my-6"
          disabled={inProgress}
          onClick={(e) => {
            setCheckCurrentPassword(true);
          }}
        >
          {inProgress ? "loading..." : "I want to delete my account forever"}
        </button>

        {errors.internalError && <ErrorsList errors={[errors.internalError]} />}
      </div>
    </>
  );
};

export default AccountDeletionForm;
