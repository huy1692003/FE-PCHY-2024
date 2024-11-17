import { apiClient } from "../constants/api";

export const insert_HT_PHANQUYEN = async (data) => {
  const res = await apiClient.post("/HT_PHANQUYEN/insert_HT_PHANQUYEN", data);
  return res;
};
export const delete_HT_PHANQUYEN = async (id) => {
  const res = await apiClient.delete(
    "/HT_PHANQUYEN/delete_HT_PHANQUYEN?id=" + id
  );
  return res;
};
export const get_HT_PHANQUYENByMA_NHOM_TV = async (ma_nhomtv) => {
  const res = await apiClient.get(
    "/HT_PHANQUYEN/get_HT_PHANQUYENByMA_NHOM_TV?ma_nhomtv=" + ma_nhomtv
  );
  return res.data;
};
