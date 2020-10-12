import { DayData } from "../types";

export const getDays = async (username: string): Promise<DayData[]> => {
  const response = await fetch(`/api/users/${username}/days/`);

  if (response.status != 200) {
    return [];
  }

  return await response.json();
};
