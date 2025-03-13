
import api from "./api";
import { toast } from "sonner";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

const setAuthData = (data: any) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({
    id: data.id,
    username: data.username,
    email: data.email,
    roles: data.roles
  }));
};

const authService = {
  login: async (loginData: LoginData) => {
    try {
      const response = await api.post("/auth/signin", loginData);
      setAuthData(response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (registerData: RegisterData) => {
    try {
      const response = await api.post("/auth/signup", registerData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.roles && user.roles.includes("ROLE_ADMIN");
  },

  // Test accounts
  getTestAccounts: () => {
    return {
      admin: {
        username: "admin",
        password: "admin123",
        roles: ["ROLE_ADMIN"]
      },
      user: {
        username: "user",
        password: "user123",
        roles: ["ROLE_CUSTOMER"]
      }
    };
  },

  // For development - simulate login with test accounts
  simulateLogin: (accountType: "admin" | "user") => {
    const accounts = authService.getTestAccounts();
    const account = accounts[accountType];
    
    if (account) {
      const mockData = {
        token: "test-token-" + accountType,
        id: accountType === "admin" ? 1 : 2,
        username: account.username,
        email: `${account.username}@example.com`,
        roles: account.roles
      };
      
      setAuthData(mockData);
      toast.success(`Logged in as ${accountType}`);
      return mockData;
    }
    
    return null;
  }
};

export default authService;
