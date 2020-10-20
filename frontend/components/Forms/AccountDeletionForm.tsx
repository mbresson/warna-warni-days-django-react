import { useRouter } from "next/router";
import React, { useState } from "react";
import PasswordCheckModal from "../Modals/PasswordCheckModal";
import { requestAccountDeletionFromServer } from "common/apis/account";

type FormErrors = {
  currentPassword?: string[];
};

const AccountDeletionForm: React.FC<{}> = () => {
  const [checkCurrentPassword, setCheckCurrentPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [inProgress, setInProgress] = useState(false);
  const router = useRouter();

  const onCurrentPasswordSubmitted = async (currentPassword: string) => {
    setCheckCurrentPassword(false);
    setInProgress(true);
    setErrors({});

    const response = await requestAccountDeletionFromServer(currentPassword);

    setInProgress(false);

    if (response.state == "succeeded") {
      alert("Your account was successfully deleted. Have a nice day!");
      router.push("/login");
    } else {
      setErrors({
        currentPassword: response.errors.current_password,
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
          onPasswordSubmitted={onCurrentPasswordSubmitted}
          onCancel={() => setCheckCurrentPassword(false)}
          errors={errors.currentPassword}
        />
      ) : null}

      <button
        className="medium bad-feeling block m-auto my-6"
        disabled={inProgress}
        onClick={(e) => {
          setCheckCurrentPassword(true);
        }}
      >
        {inProgress ? "loading..." : "I want to delete my account forever"}
      </button>
    </>
  );
};

export default AccountDeletionForm;
