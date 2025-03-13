
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
    const message = error.response?.data?.message || "An error occurred";
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

// Add service APIs
const serviceApi = {
  getAll: async (active?: boolean) => {
    const url = active ? `/services?active=${active}` : '/services';
    const response = await api.get(url);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },
  
  getByCategory: async (categoryId: number) => {
    const response = await api.get(`/services/category/${categoryId}`);
    return response.data;
  },
  
  getBySpecialist: async (specialistId: number) => {
    const response = await api.get(`/services/specialist/${specialistId}`);
    return response.data;
  }
};

// Add specialist APIs
const specialistApi = {
  getAll: async () => {
    const response = await api.get('/specialists');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/specialists/${id}`);
    return response.data;
  },
  
  getByService: async (serviceId: number) => {
    const response = await api.get(`/specialists/service/${serviceId}`);
    return response.data;
  },
  
  getSchedule: async (specialistId: number) => {
    const response = await api.get(`/specialists/${specialistId}/schedules`);
    return response.data;
  }
};

// Add quiz APIs
const quizApi = {
  getQuestions: async () => {
    const response = await api.get('/quiz/questions');
    return response.data;
  },
  
  submitAnswers: async (answers: any[]) => {
    const response = await api.post('/quiz/submit', answers);
    return response.data;
  }
};

// Add booking APIs
const bookingApi = {
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },
  
  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  cancelBooking: async (id: number) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  }
};

// Add review APIs
const reviewApi = {
  getBySpecialist: async (specialistId: number) => {
    const response = await api.get(`/reviews/specialist/${specialistId}`);
    return response.data;
  },
  
  submitReview: async (bookingId: number, reviewData: any) => {
    const response = await api.post(`/reviews/booking/${bookingId}`, reviewData);
    return response.data;
  }
};

// Add category APIs
const categoryApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }
};

export {
  api as default,
  serviceApi,
  specialistApi,
  quizApi,
  bookingApi,
  reviewApi,
  categoryApi
};
