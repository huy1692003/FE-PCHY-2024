import axios from "axios";
import { apiClient, urlServer } from "../../constants/api";


// Khai báo urlServer và các biến liên quan

// Tạo một instance Axios riêng cho việc login
const apiLoginClient = axios.create({
    baseURL: urlServer + "/APIPCHY",
    timeout: 1000 * 60 * 30 * 3,
});

// API login không kiểm tra token
export const login_HT_NGUOIDUNG = async (data) => {
    try {
        const res = await apiLoginClient.post('/HT_NGUOIDUNG/login', data);
        return res.data;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Login error:', error);
        throw error;
    }
}

export const HT_NGUOIDUNG_Service = {
    search: async (data) => {
        console.log("search nd")
        console.log({ ...data, ma_dviqly: JSON.parse(sessionStorage.getItem("current_MADVIQLY")) })
        const res = await apiClient.post("/HT_NGUOIDUNG/search", { ...data, ma_dviqly: JSON.parse(sessionStorage.getItem("current_MADVIQLY")) })
        return res.data
    },
    delete: async (id) => {
        const res = await apiClient.delete("/HT_NGUOIDUNG/delete/" + id)
        return res.data
    },
    getById: async (id) => {
        const res = await apiClient.get(`/HT_NGUOIDUNG/${id}`)
        return res.data
    },
    create: async (user) => {
        const res = await apiClient.post("/HT_NGUOIDUNG/create", user)
        return res.data
    },
    update: async (user) => {
        const res = await apiClient.patch("/HT_NGUOIDUNG/update", user)
        return res.data
    },
    lockOrUnlock: async (id, status) => {
        const res = await apiClient.put(`/HT_NGUOIDUNG/update_Trangthai/${id}/${status}`)
        return res.data
    }
    , resetPassword: async (data) => {
        console.log(data)
        const res = await apiClient.post("/HT_NGUOIDUNG/resetPassword", data)
        return res.data
    },
    getMenuByIdUser: async (idUser) => {
        const res = await apiClient.get(`/HT_NGUOIDUNG/get_HT_MENUByIdUser?userId=${idUser}`)
        return res.data
    },

    getAll: async () => {
        const res = await apiClient.post("/HT_NGUOIDUNG/search", {

            "tranG_THAI": 1,
            "pageIndex": 1,
            "pageSize": 1000000
        });
        return res.data;
    },


}