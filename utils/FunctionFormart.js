import moment from "moment";
import "moment/locale/vi"; // Import locale tiếng Việt

// Hàm format ngày (DD/MM/YYYY)
export const formatDate = (date) => {
  if (!date) return ""; // Kiểm tra giá trị null hoặc undefined
  return moment(date).locale("vi").format("DD/MM/YYYY");
};

// Hàm format ngày giờ (DD/MM/YYYY HH:mm:ss)
export const formatDateTime = (dateTime) => {
  if (!dateTime) return ""; // Kiểm tra giá trị null hoặc undefined
  return moment(dateTime).locale("vi").format("DD/MM/YYYY HH:mm:ss");
};

export const formatPrice = (amount) => {
  if (amount == null || amount === "") return ""; // Kiểm tra giá trị null hoặc undefined
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(amount)
    .replace("₫", "VNĐ"); // Thay thế ký hiệu ₫ thành VNĐ
};