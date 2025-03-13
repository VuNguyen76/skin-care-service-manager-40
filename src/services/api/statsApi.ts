
import api from './index';

export const statsApi = {
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
