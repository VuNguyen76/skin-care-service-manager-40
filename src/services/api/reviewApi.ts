
import api from './index';

export const reviewApi = {
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
