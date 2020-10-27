export const INTERNAL_ERROR =
  "The server encountered an unexpected error, please try again later";

export type BasicResponseSucceeded = {
  state: "succeeded";
};

export type BasicResponseFailed = {
  state: "failed";
  error: string;
};

export enum ApiWeekdays {
  Monday = "M",
  Sunday = "S",
}
