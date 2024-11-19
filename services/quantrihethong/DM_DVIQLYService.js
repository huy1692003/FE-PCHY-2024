import { apiClient } from "../../constants/api";

export const getAllD_DVIQLY = async () => {
  const res = await apiClient.get("/D_DVIQLY/getAllD_DVQLY");
  console.log(res)
  return res?.data;
};
