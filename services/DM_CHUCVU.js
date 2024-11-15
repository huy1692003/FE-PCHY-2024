import { apiClient } from "../constants/api";

export const getAll_DM_CHUCVU = async () => {
    const res = await apiClient.get("/DM_CHUCVU/getAll_DM_CHUCVU");
    console.log(res)
    return res.data;
};
