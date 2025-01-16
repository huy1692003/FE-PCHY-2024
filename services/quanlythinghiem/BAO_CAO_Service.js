import { apiClient } from "../../constants/api";

export const BAO_CAO_Service = {
  // Lấy báo cáo số lượng yêu cầu thí nghiệm theo khách hàng
  get_SL_QLTN_theoKhachHang: async (data) => {
    const res = await apiClient.post(
      "/BAOCAO/sl_qltn_theoKH",
      data
    );
    return res.data;
  },

  // Lấy báo cáo số lượng yêu cầu thí nghiệm theo đơn vị thực hiện
  get_SL_QLTN_theoDonViThucHien: async (data) => {
    const res = await apiClient.post(
      "/BAOCAO/sl_qltn_theo_DONVITHUCHIEN",
      data
    );
    return res.data;
  },

  // Thống kê chữ ký số theo đơn vị
  thongKeChuKySo: async (data) => {
    const res = await apiClient.post(
      "/BAOCAO/thongke_chukyso",
      data
    );
    return res.data;
  },

  // Lấy dữ liệu dashboard
  getDashboard: async (userID) => {
    const res = await apiClient.get(
      `/BAOCAO/getDashboard?userID=${userID}`
    );
    return res.data;
  }
};
