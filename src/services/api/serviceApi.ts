
import api from './index';

export const serviceApi = {
  getAll: async (active?: boolean) => {
    const url = active !== undefined ? `/services?active=${active}` : '/services';
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
