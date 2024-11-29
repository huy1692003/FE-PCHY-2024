import { apiClient } from "../../constants/api";

const initSearch = {
  search: "",
  page: 1,
  pageSize: 10000,
};
export const DM_LOAI_TAISANService = {
  get_DM_LOAI_TAISAN: async (data = initSearch) => {
    const res = await apiClient.post(
      "/DM_LOAI_TAI_SAN/Search_DM_LOAI_TAI_SAN",
      data
    );
    return res.data;
  },

  create_DM_LOAI_TAISAN: async (data) => {
    const res = await apiClient.post(
      "/DM_LOAI_TAI_SAN/insert_DM_LOAI_TAI_SAN",
      data
    );
    return res.data;
  },

  update_DM_LOAI_TAISAN: async (data) => {
    const res = await apiClient.put(
      "/DM_LOAI_TAI_SAN/update_DM_LOAI_TAI_SAN",
      data
    );
    return res.data;
  },

  deleteDM_LOAI_TAISAN: async (id) => {
    const response = await apiClient.delete(
      `/DM_LOAI_TAI_SAN/delete_DM_LOAI_TAI_SAN`,
      {
        params: {
          id,
        },
      }
    );
    return response.data;
  },
};
