
import api from './index';

export const userApi = {
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
