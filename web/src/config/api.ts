import axios from "axios";
import { STORAGE_KEY_TOKEN } from "src/pages/auth/store/authSlice";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
