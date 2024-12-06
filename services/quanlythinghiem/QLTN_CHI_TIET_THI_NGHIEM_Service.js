import { apiClient } from "../../constants/api";

const QLTN_CHI_TIET_THI_NGHIEM_Service = {
    // Lấy chi tiết thí nghiệm theo mã TBTN và mã YCTN
    get_QLTN_CHITIET_TN_by_MATBTN: async (maTBTN, maYCTN) => {
        const res = await apiClient.get(`/QLTN_CHI_TIET_THI_NGHIEM/GetByMaTBTN?maTBTN=${maTBTN}&maYCTN=${maYCTN}`);
        return res?.data;
    },

    // Lấy danh sách thiết bị kèm chi tiết thí nghiệm theo mã YCTN
    getAll_TBTN_byMA_YCTN: async (ma_yctn) => {
        const res = await apiClient.get(`/QLTN_CHI_TIET_THI_NGHIEM/getAll_TBTN_byMA_YCTN?ma_yctn=${ma_yctn}`);
        return res?.data;
    },

    // Thêm mới chi tiết thí nghiệm
    insert_QLTN_CHI_TIET_THI_NGHIEM: async (data) => {
        const res = await apiClient.post('/QLTN_CHI_TIET_THI_NGHIEM/Insert', data);
        return res?.data;
    }
};

export default QLTN_CHI_TIET_THI_NGHIEM_Service;
