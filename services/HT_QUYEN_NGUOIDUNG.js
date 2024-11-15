import { apiClient } from "../constants/api"

export const HT_QUYEN_NGUOIDUNG_Service = {
    create: async (list) => {
        console.log(list)
        let res = await apiClient.post('/HT_QUYEN_NGUOIDUNG/createMultiple', list)
        return res.data
    },
    get: async () => {
        let res = await apiClient.get('/HT_QUYEN_NGUOIDUNG/get')
        return res.data
    },
    update: async (userID, quyenID) => {
        let res = await apiClient.patch('HT_QUYEN_NGUOIDUNG/update', { mA_NGUOI_DUNG: userID, mA_NHOM_TV: String(quyenID) })
        return res.data
    },
    delete: async (id) => {
        let res = await apiClient.get('/HT_QUYEN_NGUOIDUNG/delete/' + id)
        return res.data
    }
    , getQuyenByUserID: async (id) => {
        let res = await apiClient.get('/HT_QUYEN_NGUOIDUNG/getByUserId/' + id)
        return res.data
    }

}