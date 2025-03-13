
import api from './index';

export const bookingApi = {
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
