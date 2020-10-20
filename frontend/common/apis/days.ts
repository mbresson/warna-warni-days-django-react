import { get as getCookie } from "js-cookie";

import { DayData } from "common/types";
import { INTERNAL_ERROR } from "./errors";
import { dateToLocalYYYYMMDD } from "common/utils/dateutils";

type GetDaysPageResponseSucceeded = {
  state: "succeeded";
  data: {
    count: number;
    next?: string;
    previous?: string;
    results: DayData[];
  };
};

type GetDaysPageResponseFailed = {
  state: "failed";
  error: string;
};

type GetDaysPageResponse =
  | GetDaysPageResponseSucceeded
  | GetDaysPageResponseFailed;

const getDaysPage = async (pageUrl: string): Promise<GetDaysPageResponse> => {
  try {
    const response = await fetch(pageUrl);
    const body = await response.json();

    if (response.status != 200) {
      return {
        state: "failed",
        error: body["detail"],
      };
    }

    return {
      state: "succeeded",
      data: body,
    };
  } catch {
    return {
      state: "failed",
      error: INTERNAL_ERROR,
    };
  }
};

type GetDaysResponseSucceeded = {
  state: "succeeded";
  days: DayData[];
};

type GetDaysResponseFailed = GetDaysPageResponseFailed;

type GetDaysResponse = GetDaysResponseSucceeded | GetDaysResponseFailed;

type GetDaysParams = {
  after?: Date;
  before?: Date;
  limit?: number;
  order?: "asc" | "desc";
};

export const getDays = async (
  username: string,
  params: GetDaysParams = {}
): Promise<GetDaysResponse> => {
  const queryParams = [
    "ordering=" + (params.order == "desc" ? "-date" : "date"),
  ];

  if (params.after) {
    queryParams.push("date_after=" + dateToLocalYYYYMMDD(params.after));
  }

  if (params.before) {
    queryParams.push("date_before=" + dateToLocalYYYYMMDD(params.before));
  }

  if (params.limit) {
    queryParams.push(`limit=${params.limit}`);
  }

  let days = [];

  let pageUrl = `/api/users/${username}/days/?${queryParams.join("&")}`;
  while (pageUrl) {
    const response = await getDaysPage(pageUrl);

    if (response.state == "failed") {
      return response;
    }

    days = days.concat(response.data.results);
    pageUrl = response.data.next;
  }

  return {
    state: "succeeded",
    days,
  };
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
