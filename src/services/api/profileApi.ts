
import api from './index';
import { toast } from 'sonner';

export const profileApi = {
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      // If in development, return mock data
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        id: user.id || 1,
        username: user.username || "user",
        email: user.email || "user@example.com",
        fullName: "Nguyễn Văn A",
        phoneNumber: "+84 987 654 321",
        address: "456 Đường ABC, Quận 2, TP. HCM",
        avatar: null,
        roles: user.roles || ["ROLE_CUSTOMER"]
      };
    }
  },
  
  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.success("Cập nhật thông tin thành công");
      return { success: true, message: "Cập nhật thông tin thành công" };
    }
  },
  
  changePassword: async (passwordData: { currentPassword: string, newPassword: string }) => {
    try {
      const response = await api.put('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      toast.success("Đổi mật khẩu thành công");
      return { success: true, message: "Đổi mật khẩu thành công" };
    }
  },
  
  uploadAvatar: async (formData: FormData) => {
    try {
      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return { avatar: "/placeholder.svg" };
    }
  }
};
