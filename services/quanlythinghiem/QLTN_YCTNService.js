import { apiClient } from "../../constants/api";

const QLTN_YCTNService = {
  // Tạo mới yêu cầu thí nghiệm
  create_QLTN_YCTN: async (data) => {
    try {
      const res = await apiClient.post("/QLTN_YCTN/Create", data);
      return res?.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data : "Error creating YCTN"
      );
    }
  },

  // Giao nhiệm vụ yêu cầu thí nghiệm
  giao_nhiem_vu_YCTN: async (data) => {
    try {
      const res = await apiClient.post("/QLTN_YCTN/GiaoNhiemVu", data);
      return res?.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data : "Error assigning YCTN"
      );
    }
  },


  khao_sat_phuong_an_YCTN: async (data) => {
    try {
      const res = await apiClient.post("/QLTN_YCTN/KhaoSatPhuongAn", data);
      return res?.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data : "Error assigning YCTN"
      );
    }
  },

 


  get_QLTN_YCTN_ByMAYCTN: async (MA_YCTN) => {
    try {
      const res = await apiClient.get(
        `/QLTN_YCTN/GetByMAYCTN?MA_YCTN=${MA_YCTN}`
      );
      return res?.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data : "Error getting YCTN by ID"
      );
    }
  },
  
  
    // Tìm kiếm theo mã YCTN
    search_Ma_YCTN: async (maYCTN) => {
        try {
            const url = maYCTN ? `/QLTN_YCTN/SearchMaYCTN?maYCTN=${maYCTN}` : '/QLTN_YCTN/SearchMaYCTN';
            const res = await apiClient.get(url);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error searching YCTN');
        }
    },
  

    ban_giao_ket_qua_YCTN: async (data) => {
        try {
            const res = await apiClient.post('/QLTN_YCTN/BanGiaoKetQua', data);
            return res?.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Error assigning YCTN');
        }
    },

 

//   searchTerm: "",
//   maLoaiYCTN: "",
//   donViThucHien: "f22ccd97-2f27-4a7f-b2e3-912fee4e2476",
//   pageIndex: 1,
//   pageSize: 4,
  get_DANH_SACH_YCTN: async (params) => {
    try {
      const res = await apiClient.post("/QLTN_YCTN/get_DANH_SACH_YCTN", params);
      return res?.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data : "Error fetching list of YCTN"
      );
    }
  },
};

export default QLTN_YCTNService;
