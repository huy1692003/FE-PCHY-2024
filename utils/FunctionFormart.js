import dayjs from "dayjs";
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

export const convertTimezoneToVN = (date) => {
  return dayjs(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
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

export const convertToDate = (dateInput) => {
  // Kiểm tra nếu dateInput đã là đối tượng Date hợp lệ
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    return dateInput;  // Nếu là Date hợp lệ, trả về nguyên vẹn
  }

  // Nếu không phải Date, chuyển đổi từ datetime (YYYY-MM-DD HH:mm:ss) thành đối tượng Date
  const date = new Date(dateInput);  // Chuyển đổi chuỗi thành Date

  // Kiểm tra nếu việc chuyển đổi đã thành công (Ngày hợp lệ)
  if (!isNaN(date)) {
    return date;
  }

  // Nếu không hợp lệ, trả về null hoặc giá trị mặc định
  return null;
}