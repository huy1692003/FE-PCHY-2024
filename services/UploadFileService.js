import { apiClient } from "../constants/api";

const UploadFileService = {
    image: async (file) => {
        const res = await apiClient.post("/Upload/image", file);
        return res.data;
    },

}
export default UploadFileService;
