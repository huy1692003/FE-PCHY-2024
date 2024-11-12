import { apiClient2 } from "../constants/api"

export const HT_QUYEN_NGUOIDUNG_Service = {
    create: async (list) => {
        console.log(list)
        let res = await apiClient2.post('QuyenNguoiDung/createMultiple', list)
        return true
    },
    get: async () => {
        let res = await apiClient2.get('QuyenNguoiDung/get')
        return res.data
    },
    update: async (userID, quyenID) => {
        let res = await apiClient2.patch('QuyenNguoiDung/update', { mA_NGUOI_DUNG: userID, mA_NHOM_TV: String(quyenID) })
        return res.data
    },
    delete: async (id) => {
        let res = await apiClient2.get('QuyenNguoiDung/delete/' + id)
        return res.data
    }

}