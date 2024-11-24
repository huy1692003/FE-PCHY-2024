import { apiClient } from "../../constants/api";

const DM_LOAI_YCTNService = {
    // Lấy tất cả danh mục loại yêu cầu thí nghiệm
    get_All_DM_LOAI_YCTN: async () => {
        const res = await apiClient.get('/DM_LOAI_YCTN/GetAll');
        return res?.data;
    },

    // Thêm mới danh mục loại yêu cầu thí nghiệm
    insert_DM_LOAI_YCTN: async (data) => {
        const res = await apiClient.post('/DM_LOAI_YCTN/Insert', data);
        return res?.data;
    },

    // Cập nhật danh mục loại yêu cầu thí nghiệm
    update_DM_LOAI_YCTN: async (data) => {
        const res = await apiClient.put('/DM_LOAI_YCTN/Update', data);
        return res?.data;
    },

    // Xóa danh mục loại yêu cầu thí nghiệm
    delete_DM_LOAI_YCTN: async (id) => {
        const res = await apiClient.delete(`/DM_LOAI_YCTN/Delete/${id}`);
        return res?.data;
    },

    // Thêm mới phân miền yêu cầu thí nghiệm
    insert_PHAN_MIEN_YCTN: async (data) => {
        console.log(data)
        const res = await apiClient.post('/QLTN_PHANMIEN_YCTN/Insert', data);
        return res?.data;
    },

    // Xóa phân miền yêu cầu thí nghiệm theo ID
    delete_PHAN_MIEN_YCTN: async (id) => {
        const res = await apiClient.delete(`/QLTN_PHANMIEN_YCTN/Delete/${id}`);
        return res?.data;
    },

    // Lấy danh sách phân miền yêu cầu thí nghiệm theo loại YCTN
    get_PHAN_MIEN_YCTN_BY_LOAI_YCTN: async (id_loai_yctn) => {
        console.log(id_loai_yctn)
        const res = await apiClient.get(`/QLTN_PHANMIEN_YCTN/GetByLoaiYCTN/`+id_loai_yctn);
        return res?.data;
    }
};

export default DM_LOAI_YCTNService;
