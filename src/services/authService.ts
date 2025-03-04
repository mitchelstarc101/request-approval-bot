
import api from "./apiClient";
import { getMockUsers, saveMockUsers } from "./mockStorage";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  signup: async (userData: UserData) => {
    try {
      // First try the real API
      const response = await api.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      console.log("Using mock signup instead");
      
      // Mock implementation
      const users = getMockUsers();
      
      // Check if user already exists
      if (users.some(user => user.email === userData.email)) {
        throw new Error("User with this email already exists");
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'user', // Default role
        password: userData.password // In a real app, this would be hashed
      };
      
      users.push(newUser);
      saveMockUsers(users);
      
      return { success: true };
    }
  },
  
  login: async (credentials: Credentials) => {
    try {
      // First try the real API
      const response = await api.post("/auth/login", credentials);
      
      // Store token and user data
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.log("Using mock login instead");
      
      // Mock implementation
      const users = getMockUsers();
      const user = users.find(
        user => user.email === credentials.email && user.password === credentials.password
      );
      
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      // Create mock token
      const token = `mock_token_${Date.now()}`;
      
      // Remove password before storing
      const { password, ...userWithoutPassword } = user;
      
      // Store mock token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      return {
        token,
        user: userWithoutPassword
      };
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      // First try the real API
      const response = await api.post("/auth/reset-password", { email });
      return response.data;
    } catch (error) {
      console.log("Using mock password reset instead");
      
      // Mock implementation
      const users = getMockUsers();
      const user = users.find(user => user.email === email);
      
      // For security, don't reveal whether a user exists or not
      // Just simulate success regardless
      
      // In a real app, this would send an email with a reset link/token
      return { success: true };
    }
  },
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
