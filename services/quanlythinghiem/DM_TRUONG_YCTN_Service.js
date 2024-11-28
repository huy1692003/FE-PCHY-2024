import { apiClient } from "../../constants/api";

export const DM_TRUONG_YCTN_Service = {
    getAll_DM_TRUONG_YCTN: async () => {
        const res = await apiClient.get("DM_TRUONG_YCTN/getAll_DM_TRUONG_YCTN");
        return res?.data;
    },

    create_DM_TRUONG_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/DM_TRUONG_YCTN/insert_DM_TRUONG_YCTN', data);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating TRUONG_YCTN');
        }
    },

    delete_DM_TRUONG_YCTN: async (id) => {
        const res = await apiClient.delete(`/DM_TRUONG_YCTN/delete_DM_TRUONG_YCTN?id=${id}`);
        console.log(res)
        return res?.data;
    },

    update_DM_TRUONG_YCTN: async (data) => {
        try {
            const res = await apiClient.put('/DM_TRUONG_YCTN/update_DM_TRUONG_YCTN', data);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error updating TRUONG_YCTN');
        }
    }
};