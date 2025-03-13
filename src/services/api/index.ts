
import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to handle auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor to handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Đã xảy ra lỗi";
    toast.error(message);
    
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Re-export all API services
export * from './serviceApi';
export * from './specialistApi';
export * from './categoryApi';
export * from './quizApi';
export * from './bookingApi';
export * from './reviewApi';
export * from './blogApi';
export * from './userApi';
export * from './statsApi';
export * from './settingsApi';
export * from './profileApi';
