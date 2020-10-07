import { DayData } from "../types";

export const getDays = async (username: string): Promise<[DayData]> => {
  const response = await fetch(`/api/users/${username}/days/`);

  return await response.json();
};
