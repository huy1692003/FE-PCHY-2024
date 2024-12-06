import { apiClient } from "../../constants/api";

const QLTN_NGUOI_KY_Service = {
    // Thêm mới người ký số
    insert_NGUOI_KY_SO: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_NGUOI_KY/insert_NGUOI_KY_SO', data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating NGUOI_KY_SO');
        }
    }
};

export default QLTN_NGUOI_KY_Service;
