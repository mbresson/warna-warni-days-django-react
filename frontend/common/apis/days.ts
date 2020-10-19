import { get as getCookie } from "js-cookie";

import { DayData } from "../types";
import { INTERNAL_ERROR } from "./errors";

export const getDays = async (username: string): Promise<DayData[]> => {
  const response = await fetch(`/api/users/${username}/days/`);

  if (response.status != 200) {
    return [];
  }

  return await response.json();
};

type CreateUpdateDayResponseFailed = {
  state: "failed";
  error: string;
};

type CreateUpdateDayResponseSucceeded = {
  state: "succeeded";
};

type CreateUpdateDayResponse =
  | CreateUpdateDayResponseFailed
  | CreateUpdateDayResponseSucceeded;

export const createDay = async (
  username: string,
  day: DayData
): Promise<CreateUpdateDayResponse> => {
  try {
    const csrfToken = getCookie("csrftoken");

    const response = await fetch(`/api/users/${username}/days/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(day),
    });

    if (response.status != 201) {
      const body = await response.json();
      return {
        state: "failed",
        error:
          body["detail"] ||
          "The server encountered an unexpected error, please try again later",
      };
    }

    return {
      state: "succeeded",
    };
  } catch {
    return {
      state: "failed",
      error: INTERNAL_ERROR,
    };
  }
};

export const updateDay = async (
  username: string,
  day: DayData
): Promise<CreateUpdateDayResponse> => {
  try {
    const csrfToken = getCookie("csrftoken");

    const response = await fetch(`/api/users/${username}/days/${day.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(day),
    });

    if (response.status != 200) {
      const body = await response.json();
      return {
        state: "failed",
        error:
          body["detail"] ||
          "The server encountered an unexpected error, please try again later",
      };
    }

    return {
      state: "succeeded",
    };
  } catch {
    return {
      state: "failed",
      error: INTERNAL_ERROR,
    };
  }
};
