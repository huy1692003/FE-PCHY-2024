import { apiClient } from "../../constants/api";

export const QLTN_BUOC_YCTN_Service = {
    getAll_QLTN_BUOC_YCTN: async () => {
        const res = await apiClient.get("/QLTN_BUOC_YCTN/getAll_QLTN_BUOC_YCTN");
        return res?.data;
    },

    create_QLTN_BUOC_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_BUOC_YCTN/insert_QLTN_BUOC_YCTN', data);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating QLTN_BUOC_YCTN');
        }
    },

    delete_QLTN_BUOC_YCTN: async (id) => {
        const res = await apiClient.delete(`/QLTN_BUOC_YCTN/delete_QLTN_BUOC_YCTN?id=${id}`);
        console.log(res);
        return res?.data;
    },

    update_QLTN_BUOC_YCTN: async (data) => {
        try {
            const res = await apiClient.put('/QLTN_BUOC_YCTN/update_QLTN_BUOC_YCTN', data);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error updating QLTN_BUOC_YCTN');
        }
    }
};