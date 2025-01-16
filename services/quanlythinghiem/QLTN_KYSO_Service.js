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
    },
    update_TrangThai_Ky: async (data) => {
        try {
            const res = await apiClient.post(`/QLTN_KYSO/update_TrangThai_Ky`, data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response.data||"Ký số thất bại hãy kiểm tra lại dữ liệu !");
        }
    },
    exportExcel: async (paginate,data) => {
        try {
            const res = await apiClient.post(`/QLTN_KYSO/exportExcel`, data,{
                responseType: 'blob'  // Chỉ định nhận dữ liệu dưới dạng blob
            });
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating NGUOI_KY_SO');
        }
    },
};



export default QLTN_KYSO_Service;
