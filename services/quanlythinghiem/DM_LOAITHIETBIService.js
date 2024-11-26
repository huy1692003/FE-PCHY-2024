import { apiClient } from "../../constants/api";

export const DM_LOAI_THIET_BI_Service = {
    getAll_DM_LOAITHIETBI: async () => {
        const res = await apiClient.get("/DM_LOAITHIETBI/getAll_DM_LOAITHIETBI");
        console.log(res)
        return res?.data;
    },

    create_DM_LOAITHIETBI: async (tb) => {
        try {
            const res = await apiClient.post('DM_LOAITHIETBI/insert_DM_LOAITHIETBI', tb);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating menu');
        }
    },

    delete_DM_LOAITHIETBI: async (id) => {
        const res = await apiClient.delete(`/DM_LOAITHIETBI/delete_DM_LOAITHIETBI?id=${id}`);
        console.log(res)
        return res?.data;
    },

    update_DM_LOAITHIETBI: async (tb) => {
        try {
            const res = await apiClient.put('DM_LOAITHIETBI/update_DM_LOAITHIETBI', tb);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating menu');
        }
    }
};