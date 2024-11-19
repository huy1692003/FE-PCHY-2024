import { apiClient } from "../../constants/api";

// Lấy tất cả các menu
export const get_All_HT_MENU = async () => {
    const res = await apiClient.get('/HT_MENU/get_All_HT_MENU');
    return res.data;
};

// Tạo menu mới
export const create_HT_MENU = async (menuData) => {
    try {
        const res = await apiClient.post('/HT_MENU/create_HT_MENU', menuData);
        console.log("Phản hồi từ API:", res.data); // Kiểm tra dữ liệu trả về
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : 'Error creating menu');
    }
};

// Cập nhật menu
export const update_HT_MENU = async (menuData) => {
    try {
        const res = await apiClient.put('/HT_MENU/update_HT_MENU', menuData);
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : 'Error updating menu');
    }
};

// Xóa menu
export const delete_HT_MENU = async (id) => {
    try {
        const res = await apiClient.delete(`/HT_MENU/delete_HT_MENU?id=${id}`);
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : 'Error deleting menu');
    }
};
