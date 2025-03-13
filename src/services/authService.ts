
import api from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  roles?: string[];
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
}

const authService = {
  login: async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/signin", loginRequest);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (signupRequest: SignupRequest): Promise<any> => {
    return await api.post("/auth/signup", signupRequest);
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
