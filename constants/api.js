// Đảm bảo khai báo urlServer trước khi sử dụng nó
export const urlServer = "https://localhost:44383"; 

export const token = "";
export const config = { headers: { Authorization: "Bearer " + token } };

// Khai báo apiClient sau khi urlServer đã được định nghĩa
import axios from "axios";
export const apiClient = axios.create({
  baseURL: urlServer + "/APIPCHY", // Sử dụng urlServer đã được khai báo
  timeout: 1000 * 60 * 30 * 3,
});
