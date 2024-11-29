import { apiClient } from "../../constants/api";

export const DM_LOAI_BIENBAN_Service = {
  getAllDM_LOAI_BIENBAN: async () => {
    const response = await apiClient.get("/DM_LOAI_BIENBAN/get_all_DM_LOAI_BIENBAN");
    return response.data;
  },

  insertDM_LOAI_BIENBAN: async (data) => {
    const response = await apiClient.post("/DM_LOAI_BIENBAN/insert_DM_LOAI_BIENBAN", data);
    return response.data;
  },

  updateDM_LOAI_BIENBAN: async (id, data) => {
    const response = await apiClient.put(`/DM_LOAI_BIENBAN/update_DM_LOAI_BIENBAN`, data);
    return response.data;
  },

  deleteDM_LOAI_BIENBAN: async (id) => {
    const response = await apiClient.delete(`/DM_LOAI_BIENBAN/delete_DM_LOAI_BIENBAN/${id}`);
    return response.data;
  },

  searchDM_LOAI_BIENBAN: async (searchData, pageIndex, pageSize) => {
    const response = await apiClient.post("/DM_LOAI_BIENBAN/search_DM_LOAI_BIENBAN", {
      searchData,
      pageIndex,
      pageSize
    });
    return response.data;
  }
};
