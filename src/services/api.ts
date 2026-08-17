import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://3.111.34.69:5000",
});

api.interceptors.request.use((config) => {
  const token =
    Cookies.get("token") ||
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
