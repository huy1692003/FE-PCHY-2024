import { apiClient } from "../../constants/api";

export const viewDM_DONVI = async () => {
  const res = await apiClient.post("");
};

export const getDM_DONVI_ByID = async (id) => {
  const res = await apiClient.get("/DM_DONVI/get_DM_DONVI_ByID?id=" + id);
  return res.data;
};

export const search_DM_DONVI = async (data) => {
  const res = await apiClient.post("/DM_DONVI/search_DM_DONVI", {
    ...data,
    ma_dviqly: JSON.parse(sessionStorage.getItem("current_MADVIQLY")),
  });
  console.log(data);
  return res.data;
};

export const insert_DM_DONVI = async (data) => {
  const res = await apiClient.post("/DM_DONVI/insert_DM_DONVI", data);
  return res;
};

export const update_DM_DONVI = async (data) => {
  const res = await apiClient.put("/DM_DONVI/update_DM_DONVI", data);
  return res;
};

export const delete_DM_DONVI = async (id) => {
  const res = await apiClient.delete("/DM_DONVI/delete_DM_DONVI?id=" + id);
  return res;
};

export const get_All_DM_DONVI = async () => {
  const res = await apiClient.get("/DM_DONVI/get_All_DM_DONVI");
  return res.data;
};
