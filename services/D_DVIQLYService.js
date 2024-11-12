import { apiClient } from "../constants/api";

export const getAllD_DVIQLY = async () => {
  const res = await apiClient.get("/D_DVIQLY/getAllD_DVQLY");
  return res.data;
};
