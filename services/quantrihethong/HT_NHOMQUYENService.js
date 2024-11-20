import { apiClient } from "../../constants/api"

export const create_HT_NHOMQUYEN = async (data) => {
    const res = await apiClient.post('/HT_NHOMQUYEN/create_HT_NHOMQUYEN', data)
    return res.data
}

export const update_HT_NHOMQUYEN = async (data) => {
    const res = await apiClient.put('/HT_NHOMQUYEN/update_HT_NHOMQUYEN', data)
    return res
}

export const delete_HT_NHOMQUYEN = async (id) => {
    const res = await apiClient.delete('/HT_NHOMQUYEN/delete_HT_NHOMQUYEN?id=' + id)
    return res
}

export const search_HT_NHOMQUYEN = async (data) => {
    const res = await apiClient.post('/HT_NHOMQUYEN/search_HT_NHOMQUYEN', {...data,ma_dviqly:JSON.parse(sessionStorage.getItem("current_MADVIQLY"))})
    return res.data
}

export const get_HT_NHOMQUYEN_ByID = async (id) => {
    const res = await apiClient.get('/HT_NHOMQUYEN/get_HT_NHOMQUYEN_By_ID?id=' + id);
    return res.data
}
export const getNhomQuyen_byMaDVQLY = async (maDV) => {
    const res = await apiClient.get('/HT_NHOMQUYEN/getNhomQuyen_byMaDV?maDViqly=' + maDV)
    return res.data
}