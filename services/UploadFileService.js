import { apiClient } from "../constants/api";

const UploadFileService = {
    image: async (file) => {
        const res = await apiClient.post("/Upload/image", file);
        return res.data;
    },
    file: async (formData,typeFile = "fileYCTN") => {       
        const res = await apiClient.post("/Upload/file", formData);
        return res.data;
    },

}
export default UploadFileService;
