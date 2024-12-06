import { apiClient } from "../../constants/api";

export const QLTN_THIET_BI_YCTN_Service = {
    getAll_QLTN_THIET_BI_YCTN_byMA_YCTN: async (data) => {
        const res = await apiClient.post('/QLTN_THIET_BI_YCTN_/getAll_thietbi_byMA_YCTN',data);
        return res?.data;
    },

    create_QLTN_THIET_BI_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_THIET_BI_YCTN/insert_QLTN_THIET_BI_YCTN', data);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating THIET_BI_YCTN');
        }
    },

    delete_QLTN_THIET_BI_YCTN: async (id) => {
        const res = await apiClient.delete(`/QLTN_THIET_BI_YCTN/delete_QLTN_THIET_BI_YCTN?id=${id}`);
        console.log(res)
        return res?.data;
    },

    update_QLTN_THIET_BI_YCTN: async (data) => {
        try {
            const res = await apiClient.put('/QLTN_THIET_BI_YCTN/update_QLTN_THIET_BI_YCTN', data);
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error updating THIET_BI_YCTN');
        }
    }
    ,
    importExcel_QLTN_THIET_BI_YCTN: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await apiClient.post('/QLTN_THIET_BI_YCTN_/importExcel_Thiet_Bi_YCTN', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Phản hồi từ API:", res.data);
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error importing Excel file');
        }
    }
    ,
    create_Multiple_QLTN_THIET_BI_YCTN: async (devices) => {
        try {
            const res = await apiClient.post('QLTN_THIET_BI_YCTN_/insert_Multiple_Thiet_Bi_YCTN', devices);
            console.log("Phản hồi từ API:", res.data); 
            return res.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error creating multiple THIET_BI_YCTN');
        }
    }

    ,
    downloadExcelTemplate_Thiet_Bi_YCTN: async () => {
        try {
            const res = await apiClient.get('/QLTN_THIET_BI_YCTN_/downloadExcelTemplate_Thiet_Bi_YCTN', {
                responseType: 'blob'
            });
    
            // Lấy tên file từ Content-Disposition header
            const contentDisposition = res.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : `template_thiet_bi_yctn_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`;
                
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link); // Thêm link vào document
            link.click(); // Kích hoạt sự kiện click
            document.body.removeChild(link); // Xóa link sau khi đã tải
            window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ
    
            return true;
        } catch (error) {
            console.error('Error downloading template:', error);
            throw new Error('Không thể tải file mẫu. Vui lòng thử lại sau.');
        }
    }
};
