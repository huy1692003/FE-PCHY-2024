import { apiClient } from "../../constants/api";

const QLTN_YCTNService = {
    // Tạo mới yêu cầu thí nghiệm
    create_QLTN_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_YCTN/Create', data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating YCTN');
        }
    },

    // Giao nhiệm vụ yêu cầu thí nghiệm
    giao_nhiem_vu_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_YCTN/GiaoNhiemVu', data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error assigning YCTN');
        }
    }
};
export default QLTN_YCTNService;
