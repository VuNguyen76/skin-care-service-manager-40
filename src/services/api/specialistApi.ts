
import api from './index';

export const specialistApi = {
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
