import { apiClient } from "../../constants/api";

export const getAll_DM_LOAITHIETBI = async () => {
    const res = await apiClient.get("/DM_LOAITHIETBI_Controler/getAll_DM_LOAITHIETBI");
    console.log(res)
    return res?.data;
};