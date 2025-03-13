
import api from './index';

export const settingsApi = {
  getGeneralSettings: async () => {
    try {
      const response = await api.get('/settings/general');
      return response.data;
    } catch (error) {
      console.error("Error fetching general settings:", error);
      // Return default settings as fallback
      return {
        siteName: "BEAUTYCARE",
        siteDescription: "Dịch vụ chăm sóc da cao cấp phù hợp với nhu cầu và mục tiêu riêng của bạn.",
        contactEmail: "contact@beautycare.com",
        contactPhone: "+84 123 456 789",
        address: "123 Đường Làm Đẹp, Quận 1, TP. HCM"
      };
    }
  },
  
  updateGeneralSettings: async (settings: any) => {
    const response = await api.put('/settings/general', settings);
    return response.data;
  },
  
  getContactSettings: async () => {
    try {
      const response = await api.get('/settings/contact');
      return response.data;
    } catch (error) {
      console.error("Error fetching contact settings:", error);
      return {
        address: "123 Đường Làm Đẹp, Quận 1, TP. HCM",
        phone: "+84 123 456 789",
        email: "contact@beautycare.com",
        workingHours: "Thứ 2 - Thứ 7: 9:00 - 18:00"
      };
    }
  },
  
  getSocialSettings: async () => {
    try {
      const response = await api.get('/settings/social');
      return response.data;
    } catch (error) {
      console.error("Error fetching social settings:", error);
      return {
        facebook: "https://facebook.com/beautycare",
        instagram: "https://instagram.com/beautycare",
        twitter: "https://twitter.com/beautycare",
        youtube: "https://youtube.com/beautycare"
      };
    }
  },
  
  updateSettings: async (data: { category: string, settings: any }) => {
    const { category, settings } = data;
    const response = await api.put(`/settings/${category}`, settings);
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
  
  updateBookingSettings: async (settings: any) => {
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
        adminNotificationEmail: "admin@beautycare.com"
      };
    }
  },
  
  updateNotificationSettings: async (settings: any) => {
    const response = await api.put('/settings/notifications', settings);
    return response.data;
  }
};
