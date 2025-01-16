import axios from "axios";

// Khai báo urlServer và các biến liên quan
export const urlServer = "https://localhost:44383";

// Kiểm tra môi trường để đảm bảo chỉ sử dụng sessionStorage trong trình duyệt
const token_session = typeof window !== "undefined" && window.sessionStorage ? sessionStorage.getItem("token") : null;
export const token = token_session || "";

// Cấu hình headers mặc định
export const config = { 
  headers: { 
    Authorization: "Bearer " + token 
  } 
};

// Tạo Axios instance
export const apiClient = axios.create({
  baseURL: urlServer + "/APIPCHY",
  timeout: 1000 * 60 * 30 * 3,
});

// Thêm interceptor để kiểm tra token
apiClient.interceptors.request.use(
  (config) => {
    // Kiểm tra token trước khi gửi request
    const currentToken = typeof window !== "undefined" && window.sessionStorage ? sessionStorage.getItem("token") : null;
    if (currentToken) {
      config.headers.Authorization = "Bearer " + currentToken;
    } else {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      const loginUrl = `${window.location.origin}/auth/login`;
      window.location.href = loginUrl;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi khi tạo request
    return Promise.reject(error);
  }
);

// Thêm interceptor để kiểm tra lỗi trong response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu server trả về lỗi 401 (Unauthorized), chuyển hướng về trang đăng nhập
      const loginUrl = `${window.location.origin}/auth/login`;
      window.location.href = loginUrl;
    }
    return Promise.reject(error);
  }
);
