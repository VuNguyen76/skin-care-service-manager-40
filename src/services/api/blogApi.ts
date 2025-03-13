
import api from './index';

export const blogApi = {
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
