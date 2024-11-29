import { apiClient } from "../../constants/api";

export const DM_KHACHHANG_Service = {
  get_DM_KHACHHANG: async (data) => {
    const res = await apiClient.post(
      "/DM_KHACH_HANG/search_DM_KHACH_HANG",
      data
    );
    return res.data;
  },

  create_DM_KHACHHANG: async (data) => {
    const res = await apiClient.post(
      "/DM_KHACH_HANG/insert_DM_KHACH_HANG",
      data
    );
    return res.data;
  },

  update_DM_KHACHHANG: async (data) => {
    const res = await apiClient.put(
      "/DM_KHACH_HANG/update_DM_KHACH_HANG",
      data
    );
    return res.data;
  },

  delete_DM_KHACHHANG: async (id) => {
    const res = await apiClient.delete(
      "/DM_KHACH_HANG/delete_DM_KHACH_HANG",
      {
        params: {
          id,
        },
      }
    );
    return res.data;
  },
};
