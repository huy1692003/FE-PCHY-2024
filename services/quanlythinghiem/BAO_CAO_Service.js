import { apiClient } from "../../constants/api";
export const BAO_CAO_Service = {
    get_SL_QLTN_theoKhachHang: async (data) => {
      const res = await apiClient.post(
        "/BAOCAO/sl_qltn_theoKH",
        data
      );
      return res.data;
    },
    get_SL_QLTN_theoDonViThucHien: async (data) => {
      const res = await apiClient.post(
        "/BAOCAO/sl_qltn_theo_DONVITHUCHIEN",
        data
      );
      return res.data;
    },
  };