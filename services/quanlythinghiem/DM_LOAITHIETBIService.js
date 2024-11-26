import { apiClient } from "../../constants/api";

export const getAll_DM_LOAITHIETBI = async () => {
    const res = await apiClient.get("/DM_LOAITHIETBI/getAll_DM_LOAITHIETBI");
    console.log(res)
    return res?.data;
};
export const create_DM_LOAITHIETBI = async (tb) => {
    try {
        const res = await apiClient.post('DM_LOAITHIETBI/insert_DM_LOAITHIETBI', tb);
        console.log("Phản hồi từ API:", res.data); // Kiểm tra dữ liệu trả về
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : 'Error creating menu');
    }
};
export const delete_DM_LOAITHIETBI = async (id) => {
    const res = await apiClient.delete(`/DM_LOAITHIETBI/delete_DM_LOAITHIETBI?id=${id}`);
    console.log(res)
    return res?.data;
};

export const update_DM_LOAITHIETBI = async (tb) => {
    try {
        const res = await apiClient.put('DM_LOAITHIETBI/update_DM_LOAITHIETBI', tb);
        console.log("Phản hồi từ API:", res.data); // Kiểm tra dữ liệu trả về
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : 'Error creating menu');
    }
};