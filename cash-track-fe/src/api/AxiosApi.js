import axios from "axios";
import { redirectToLogin } from "../utils/navigator";

var API_URL = "http://localhost:8080/";
const AxiosApi = axios.create({
  baseURL: API_URL,
});

AxiosApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      redirectToLogin();
      return Promise.resolve();
    }
    return Promise.reject(err);
  }
);


AxiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default AxiosApi;