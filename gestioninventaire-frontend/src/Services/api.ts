import axios from "axios";
import { getToken } from "./tokenService";
const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json", },

},
);
export default api;

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


