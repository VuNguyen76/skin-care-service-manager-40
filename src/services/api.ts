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
  },
  
  // Admin functions
  createService: async (serviceData: any) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },
  
  updateService: async (id: number, serviceData: any) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },
  
  deleteService: async (id: number) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};

// Add specialist APIs
const specialistApi = {
  getAll: async (params?: { minRating?: number, keyword?: string, name?: string }) => {
    let url = '/specialists';
    const queryParams = new URLSearchParams();
    
    if (params?.minRating) queryParams.append('minRating', params.minRating.toString());
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.name) queryParams.append('name', params.name);
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
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
  },
  
  getAvailableTimeSlots: async (specialistId: number, date: string) => {
    const response = await api.get(`/specialists/${specialistId}/available-slots?date=${date}`);
    return response.data;
  },
  
  // Admin functions
  createSpecialist: async (specialistData: any) => {
    const response = await api.post('/specialists', specialistData);
    return response.data;
  },
  
  updateSpecialist: async (id: number, specialistData: any) => {
    const response = await api.put(`/specialists/${id}`, specialistData);
    return response.data;
  },
  
  deleteSpecialist: async (id: number) => {
    const response = await api.delete(`/specialists/${id}`);
    return response.data;
  },
  
  getTopRated: async (minReviews: number = 5) => {
    const response = await api.get(`/specialists/top-rated?minReviews=${minReviews}`);
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
  },
  
  // Admin functions
  createQuestion: async (questionData: any) => {
    const response = await api.post('/quiz/questions', questionData);
    return response.data;
  },
  
  updateQuestion: async (id: number, questionData: any) => {
    const response = await api.put(`/quiz/questions/${id}`, questionData);
    return response.data;
  },
  
  deleteQuestion: async (id: number) => {
    const response = await api.delete(`/quiz/questions/${id}`);
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
  },
  
  rescheduleBooking: async (id: number, newDateTime: string) => {
    const response = await api.put(`/bookings/${id}/reschedule`, { newDateTime });
    return response.data;
  },
  
  getBookingDetails: async (id: number) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  // Admin functions
  getAllBookings: async (params?: { status?: string, startDate?: string, endDate?: string }) => {
    let url = '/bookings/admin';
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  updateBookingStatus: async (id: number, status: string) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
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
  },
  
  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },
  
  // Admin functions
  getAllReviews: async (params?: { approved?: boolean, minRating?: number, maxRating?: number }) => {
    let url = '/reviews/admin';
    const queryParams = new URLSearchParams();
    
    if (params?.approved !== undefined) queryParams.append('approved', params.approved.toString());
    if (params?.minRating) queryParams.append('minRating', params.minRating.toString());
    if (params?.maxRating) queryParams.append('maxRating', params.maxRating.toString());
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  approveReview: async (id: number) => {
    const response = await api.put(`/reviews/${id}/approve`);
    return response.data;
  },
  
  rejectReview: async (id: number) => {
    const response = await api.put(`/reviews/${id}/reject`);
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
  },
  
  // Admin functions
  createCategory: async (categoryData: any) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  
  updateCategory: async (id: number, categoryData: any) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

// Blog APIs
const blogApi = {
  getAll: async (params?: { published?: boolean, tag?: string }) => {
    let url = '/blogs';
    const queryParams = new URLSearchParams();
    
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());
    if (params?.tag) queryParams.append('tag', params.tag);
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },
  
  getByTag: async (tagId: number) => {
    const response = await api.get(`/blogs/tag/${tagId}`);
    return response.data;
  },
  
  // Admin functions
  createBlog: async (blogData: any) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },
  
  updateBlog: async (id: number, blogData: any) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },
  
  deleteBlog: async (id: number) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
  
  publishBlog: async (id: number) => {
    const response = await api.put(`/blogs/${id}/publish`);
    return response.data;
  },
  
  unpublishBlog: async (id: number) => {
    const response = await api.put(`/blogs/${id}/unpublish`);
    return response.data;
  }
};

// User management APIs (admin only)
const userApi = {
  getAll: async (params?: { role?: string, active?: boolean }) => {
    let url = '/users/admin';
    const queryParams = new URLSearchParams();
    
    if (params?.role) queryParams.append('role', params.role);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/users/admin/${id}`);
    return response.data;
  },
  
  createUser: async (userData: any) => {
    const response = await api.post('/users/admin', userData);
    return response.data;
  },
  
  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`/users/admin/${id}`, userData);
    return response.data;
  },
  
  activateUser: async (id: number) => {
    const response = await api.put(`/users/admin/${id}/activate`);
    return response.data;
  },
  
  deactivateUser: async (id: number) => {
    const response = await api.put(`/users/admin/${id}/deactivate`);
    return response.data;
  },
  
  assignRole: async (id: number, role: string) => {
    const response = await api.put(`/users/admin/${id}/role`, { role });
    return response.data;
  }
};

// Settings APIs
const settingsApi = {
  getGeneralSettings: async () => {
    try {
      const response = await api.get('/settings/general');
      return response.data;
    } catch (error) {
      console.error("Error fetching general settings:", error);
      // Return default settings as fallback
      return {
        siteName: "BeautySkin",
        siteDescription: "Premium skincare services tailored to your unique needs and goals.",
        contactEmail: "contact@beautyskin.com",
        contactPhone: "+84 123 456 789",
        address: "123 Đường Làm Đẹp, Quận 1, TP. HCM"
      };
    }
  },
  
  updateGeneralSettings: async (settings) => {
    const response = await api.put('/settings/general', settings);
    return response.data;
  },
  
  getBookingSettings: async () => {
    try {
      const response = await api.get('/settings/booking');
      return response.data;
    } catch (error) {
      console.error("Error fetching booking settings:", error);
      return {
        allowFutureBookingsDays: 30,
        minAdvanceBookingHours: 24,
        maxServicesPerBooking: 3,
        requiresPayment: true,
        requiresConfirmation: true,
        allowCancellationHours: 48,
        workingHoursStart: "09:00",
        workingHoursEnd: "18:00"
      };
    }
  },
  
  updateBookingSettings: async (settings) => {
    const response = await api.put('/settings/booking', settings);
    return response.data;
  },
  
  getNotificationSettings: async () => {
    try {
      const response = await api.get('/settings/notifications');
      return response.data;
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      return {
        sendBookingConfirmations: true,
        sendBookingReminders: true,
        reminderHoursBefore: 24,
        sendCancellationNotifications: true,
        sendAdminNotifications: true,
        adminNotificationEmail: "admin@beautyskin.com"
      };
    }
  },
  
  updateNotificationSettings: async (settings) => {
    const response = await api.put('/settings/notifications', settings);
    return response.data;
  }
};

// User Profile APIs
const profileApi = {
  getUserProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.put('/user/change-password', passwordData);
    return response.data;
  },
  
  uploadAvatar: async (formData) => {
    const response = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Stats and reports APIs (admin only)
const statsApi = {
  getDashboardStats: async () => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },
  
  getBookingStats: async (params?: { period?: string, startDate?: string, endDate?: string }) => {
    let url = '/stats/bookings';
    const queryParams = new URLSearchParams();
    
    if (params?.period) queryParams.append('period', params.period);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  getRevenueStats: async (params?: { period?: string, startDate?: string, endDate?: string }) => {
    let url = '/stats/revenue';
    const queryParams = new URLSearchParams();
    
    if (params?.period) queryParams.append('period', params.period);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  getServicePopularity: async () => {
    const response = await api.get('/stats/services/popularity');
    return response.data;
  },
  
  getSpecialistPerformance: async () => {
    const response = await api.get('/stats/specialists/performance');
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
  categoryApi,
  blogApi,
  userApi,
  statsApi,
  settingsApi,
  profileApi
};
