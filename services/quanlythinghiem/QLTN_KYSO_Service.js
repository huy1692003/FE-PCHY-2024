import { apiClient } from "../../constants/api";

const QLTN_KYSO_Service = {
    // Thêm mới người ký số
    SEARCH_VANBAN: async (paginate,data) => {
        try {
            const res = await apiClient.post(`/QLTN_KYSO/search_document?Page=${paginate.page}&PageSize=${paginate.pageSize}`, data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating NGUOI_KY_SO');
        }
    }
};

export default QLTN_KYSO_Service;
