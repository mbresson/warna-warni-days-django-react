import { get as getCookie } from "js-cookie";

type LoginResponseFailed = {
  state: "failed";
  error: string;
};

type LoginResponseSucceeded = {
  state: "succeeded";
};

export type LoginResponse = LoginResponseFailed | LoginResponseSucceeded;

export const loginToServer = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status == 200) {
      return {
        state: "succeeded",
      };
    } else {
      const body = await response.json();

      return {
        state: "failed",
        error: body["detail"],
      };
    }
  } catch {
    return {
      state: "failed",
      error:
        "The server encountered an unexpected error, please try again later",
    };
  }
};

export const logoutFromServer = async (): Promise<void> => {
  const csrfToken = getCookie("csrftoken");

  await fetch("/api/auth/logout/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

type SignUpResponseFailed = {
  state: "failed";
  errors: {
    [fieldName: string]: string[];
  };
};

type SignUpResponseSucceeded = {
  state: "succeeded";
};

export type SignUpResponse = SignUpResponseFailed | SignUpResponseSucceeded;

export const signUpToServer = async (
  username: string,
  password: string,
  email: string
): Promise<SignUpResponse> => {
  try {
    const response = await fetch("/api/auth/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });

    if (response.status == 201) {
      return {
        state: "succeeded",
      };
    } else {
      return {
        state: "failed",
        errors: await response.json(),
      };
    }
  } catch {
    return {
      state: "failed",
      errors: {
        internalError: [
          "The server encountered an unexpected error, please try again later",
        ],
      },
    };
  }
};

type PasswordResetResponseFailed = {
  state: "failed";
  error: string;
};

type PasswordResetResponseSucceeded = {
  state: "succeeded";
};

export type PasswordResetResponse =
  | PasswordResetResponseFailed
  | PasswordResetResponseSucceeded;

export const requestPasswordResetFromServer = async (
  username: string,
  email: string
): Promise<PasswordResetResponse> => {
  try {
    const response = await fetch("/api/auth/reset-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
      }),
    });

    if (response.status == 200) {
      return {
        state: "succeeded",
      };
    } else {
      const body = await response.json();

      return {
        state: "failed",
        error: body["detail"],
      };
    }
  } catch {
    return {
      state: "failed",
      error:
        "The server encountered an unexpected error, please try again later",
    };
  }
};

type ChangePasswordResponseFailed = {
  state: "failed";
  errors: {
    [fieldName: string]: string[];
  };
};

type ChangePasswordResponseSucceeded = {
  state: "succeeded";
};

export type ChangePasswordResponse =
  | ChangePasswordResponseFailed
  | ChangePasswordResponseSucceeded;

export const requestPasswordChangeFromServer = async (
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  try {
    const csrfToken = getCookie("csrftoken");

    const response = await fetch("/api/auth/change-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (response.status == 200) {
      return {
        state: "succeeded",
      };
    } else {
      return {
        state: "failed",
        errors: await response.json(),
      };
    }
  } catch {
    return {
      state: "failed",
      errors: {
        internalError: [
          "The server encountered an unexpected error, please try again later",
        ],
      },
    };
  }
};

type AccountDeletionResponseFailed = {
  state: "failed";
  errors: {
    [fieldName: string]: string[];
  };
};

type AccountDeletionResponseSucceeded = {
  state: "succeeded";
};

export type AccountDeletionResponse =
  | AccountDeletionResponseFailed
  | AccountDeletionResponseSucceeded;

export const requestAccountDeletionFromServer = async (
  currentPassword: string
): Promise<AccountDeletionResponse> => {
  try {
    const csrfToken = getCookie("csrftoken");

    const response = await fetch("/api/auth/delete-account/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        current_password: currentPassword,
      }),
    });

    if (response.status == 200) {
      return {
        state: "succeeded",
      };
    } else {
      return {
        state: "failed",
        errors: await response.json(),
      };
    }
  } catch {
    return {
      state: "failed",
      errors: {
        internalError: [
          "The server encountered an unexpected error, please try again later",
        ],
      },
    };
  }
};
