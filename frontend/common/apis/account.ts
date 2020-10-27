import { get as getCookie } from "js-cookie";
import {
  INTERNAL_ERROR,
  BasicResponseFailed,
  BasicResponseSucceeded,
  ApiWeekdays,
} from "./responses";

export type LoginResponse = BasicResponseFailed | BasicResponseSucceeded;

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
      return { state: "succeeded" };
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

export type SignUpResponse = SignUpResponseFailed | BasicResponseSucceeded;

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
      return { state: "succeeded" };
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
        internalError: [INTERNAL_ERROR],
      },
    };
  }
};

export type PasswordResetResponse =
  | BasicResponseFailed
  | BasicResponseSucceeded;

export const requestPasswordReset = async (
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
      return { state: "succeeded" };
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

type UpdateAccountResponseFailed = {
  state: "failed";
  errors: {
    password?: string[];
    email?: string[];
    current_password?: string;
    other?: string;
  };
};

export type UpdateAccountResponse =
  | UpdateAccountResponseFailed
  | BasicResponseSucceeded;

export type UpdateAccountChangeset = {
  email?: string;
  password?: string;
  preferred_first_weekday?: ApiWeekdays;
};

export const updateAccount = async (
  changes: UpdateAccountChangeset,
  currentPassword?: string
): Promise<UpdateAccountResponse> => {
  try {
    const csrfToken = getCookie("csrftoken");

    const response = await fetch("/api/auth/account/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        ...changes,
      }),
    });

    if (response.status == 200) {
      return { state: "succeeded" };
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
        other: INTERNAL_ERROR,
      },
    };
  }
};

type AccountDeletionResponseFailed = {
  state: "failed";
  errors: {
    current_password?: string;
    other?: string;
  };
};

export type AccountDeletionResponse =
  | AccountDeletionResponseFailed
  | BasicResponseSucceeded;

export const deleteAccountFromServer = async (
  currentPassword: string
): Promise<AccountDeletionResponse> => {
  try {
    const csrfToken = getCookie("csrftoken");

    const response = await fetch("/api/auth/account/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        current_password: currentPassword,
      }),
    });

    if (response.status == 204) {
      return { state: "succeeded" };
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
        other: INTERNAL_ERROR,
      },
    };
  }
};
