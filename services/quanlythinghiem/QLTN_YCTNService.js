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
    },


    // Cập nhật yêu cầu thí nghiệm
    update_QLTN_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_YCTN/Update', data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error updating YCTN');
        }
    },

    // Xóa yêu cầu thí nghiệm
    delete_QLTN_YCTN: async (maYCTN) => {
        try {
            const res = await apiClient.delete(`/QLTN_YCTN/Delete/${maYCTN}`);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error deleting YCTN');
        }
    },


    khao_sat_phuong_an_YCTN: async(data) => {
        try {
            const res = await apiClient.post('/QLTN_YCTN/KhaoSatPhuongAn', data);
            return res?.data
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error assigning YCTN');
        }
    } ,

    ban_giao_ket_qua_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_YCTN/BanGiaoKetQua', data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error assigning YCTN');
        }
    },

    // Tìm kiếm theo mã YCTN
    search_Ma_YCTN: async (maYCTN) => {
        try {
            const url = maYCTN ? `/QLTN_YCTN/SearchMaYCTN?maYCTN=${maYCTN}` : '/QLTN_YCTN/SearchMaYCTN';
            const res = await apiClient.get(url);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error searching YCTN');
        }
    },

    // Lấy thông tin YCTN theo mã
    get_QLTN_YCTN_ByMAYCTN: async (MA_YCTN) => {
        try {
            const res = await apiClient.get(`/QLTN_YCTN/GetByMAYCTN?MA_YCTN=${MA_YCTN}`);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error getting YCTN by ID');
        }
    }
};

export default QLTN_YCTNService;
