import { apiClient } from "../constants/api";
import { apiClient2 } from "../constants/api";

export const login_HT_NGUOIDUNG = async(data) => {
    const res = await apiClient.post('/HT_NGUOIDUNG/login', data);
    return res.data
}

export const HT_NGUOIDUNG_Service = {
    get: async (pageIndex, pageSize) => {
        const res = await apiClient2.post("HTNguoiDung/get", { pageIndex: pageIndex + "", pageSize: pageSize + "" })
        return res.data
    },
    search: async (data) => {
        const res = await apiClient2.post("HTNguoiDung/search", data)
        return res.data
    },
    delete: async (user) => {
        const res = await apiClient2.delete("HTNguoiDung/search", user)
        return res.data
    },
    create: async (user) => {
        const res = await apiClient2.post("HTNguoiDung/create", user)
        return res.data
    },
    update: async (user) => {
        const res = await apiClient2.patch("HTNguoiDung/update", user)
        return res.data
    }


}