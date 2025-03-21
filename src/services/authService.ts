
import api from "./api/index";
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

interface UserData {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
}

const setAuthData = (data: UserData) => {
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
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  },

  register: async (registerData: RegisterData) => {
    try {
      const response = await api.post("/auth/signup", registerData);
      return response.data;
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đã đăng xuất thành công");
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

  // Tài khoản thử nghiệm
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

  // Dành cho phát triển - giả lập đăng nhập với tài khoản thử nghiệm
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
      toast.success(`Đã đăng nhập với tài khoản ${accountType === "admin" ? "quản trị viên" : "người dùng"}`);
      return mockData;
    }
    
    return null;
  }
};

export default authService;
