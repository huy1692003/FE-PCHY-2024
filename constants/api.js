import axios from "axios";
export const apiClient = axios.create({
  baseURL: "https://localhost:44383/APIPCHY",
  timeout: 1000 * 60 * 30 * 3,
});

export const apiClient2 = axios.create({
  baseURL: "http://localhost:44469/APIPCHY/",
  timeout: 1000 * 60 * 30 * 3,
}); 

export const token = "";
export const config = { headers: { Authorization: "Bearer " + token } };
