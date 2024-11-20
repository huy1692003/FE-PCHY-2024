import { apiClient } from "../../constants/api";

export const searchDM_PHONGBAN = async (data) => {
  const res = await apiClient.post("/DM_PHONGBAN/search_DM_PHONGBAN", data);
  return res.data;
};

export const insertDM_PHONGBAN = async (data) => {
  const res = await apiClient.post("/DM_PHONGBAN/insert_DM_PHONGBAN", data);
  return res;
};

export const updateDM_PHONGBAN = async (data) => {
  const res = await apiClient.put("/DM_PHONGBAN/update_DM_PHONGBAN", data);
  return res;
};

export const deleteDM_PHONGBAN = async (id) => {
  console.log(id);
  const res = await apiClient.delete(
    "/DM_PHONGBAN/delete_DM_PHONGBAN?ID=" + id
  );
  return res;
};
export const getDM_PHONGBANById = async (id) => {
  const res = await apiClient.get("/DM_PHONGBAN/get_DM_PHONGBANByID?ID=" + id);
  return res.data;
};
