import axios from "axios";
import { toast } from "@/components/ui/use-toast";

// Define the base URL for your API
const API_URL = "http://localhost:3001/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle common errors
    if (response) {
      const { status, data } = response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      } else if (status === 403) {
        toast({
          title: "Access denied",
          description: data.message || "You don't have permission to perform this action.",
          variant: "destructive",
        });
      } else if (status === 404) {
        toast({
          title: "Not found",
          description: data.message || "The requested resource was not found.",
          variant: "destructive",
        });
      } else if (status === 500) {
        toast({
          title: "Server error",
          description: "Something went wrong on our servers. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } else {
      // Network error
      console.log("Network error detected, using mock authentication instead");
    }
    
    return Promise.reject(error);
  }
);

// Mock Users Storage
const getMockUsers = () => {
  const users = localStorage.getItem('mock_users');
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Mock Leave Requests Storage
const getMockLeaveRequests = () => {
  const requests = localStorage.getItem('mock_leave_requests');
  return requests ? JSON.parse(requests) : [];
};

const saveMockLeaveRequests = (requests) => {
  localStorage.setItem('mock_leave_requests', JSON.stringify(requests));
};

// Auth Service with mock fallback
export const authService = {
  signup: async (userData: any) => {
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
  
  login: async (credentials: any) => {
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
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Leave Requests Service with mock fallback
export const leaveRequestService = {
  create: async (leaveData: any) => {
    try {
      // First try the real API
      const response = await api.post("/leave", leaveData);
      return response.data;
    } catch (error) {
      console.log("Using mock leave request creation instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to create a leave request");
      }
      
      // Get existing requests
      const requests = getMockLeaveRequests();
      
      // Create new request
      const newRequest = {
        id: `leave_${Date.now()}`,
        user_id: currentUser.id,
        user_name: currentUser.name,
        leave_type: leaveData.leave_type,
        start_date: leaveData.start_date,
        end_date: leaveData.end_date,
        reason: leaveData.reason,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      requests.push(newRequest);
      saveMockLeaveRequests(requests);
      
      return newRequest;
    }
  },
  
  getMyRequests: async () => {
    try {
      // First try the real API
      const response = await api.get("/leave");
      return response.data;
    } catch (error) {
      console.log("Using mock leave requests instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to view leave requests");
      }
      
      // Get and filter requests for current user
      const requests = getMockLeaveRequests();
      return requests.filter(req => req.user_id === currentUser.id);
    }
  },
  
  getAllRequests: async () => {
    try {
      // First try the real API
      const response = await api.get("/leave/all");
      return response.data;
    } catch (error) {
      console.log("Using mock all leave requests instead");
      
      // Get current user to check if admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("You don't have permission to access all leave requests");
      }
      
      // Return all requests
      return getMockLeaveRequests();
    }
  },
  
  update: async (id: string, leaveData: any) => {
    try {
      // First try the real API
      const response = await api.put(`/leave/${id}`, leaveData);
      return response.data;
    } catch (error) {
      console.log("Using mock leave request update instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to update a leave request");
      }
      
      // Get and update the specific request
      const requests = getMockLeaveRequests();
      const requestIndex = requests.findIndex(req => req.id === id);
      
      if (requestIndex === -1) {
        throw new Error("Leave request not found");
      }
      
      const request = requests[requestIndex];
      
      // Check if user owns this request
      if (request.user_id !== currentUser.id) {
        throw new Error("You can only update your own leave requests");
      }
      
      // Check if request is still pending
      if (request.status !== "pending") {
        throw new Error("Only pending requests can be updated");
      }
      
      // Update request
      const updatedRequest = {
        ...request,
        leave_type: leaveData.leave_type,
        start_date: leaveData.start_date,
        end_date: leaveData.end_date,
        reason: leaveData.reason,
        updated_at: new Date().toISOString()
      };
      
      requests[requestIndex] = updatedRequest;
      saveMockLeaveRequests(requests);
      
      return updatedRequest;
    }
  },
  
  approve: async (id: string) => {
    try {
      // First try the real API
      const response = await api.put(`/leave/approve/${id}`);
      return response.data;
    } catch (error) {
      console.log("Using mock leave request approval instead");
      
      // Get current user to check if admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Only administrators can approve leave requests");
      }
      
      // Get and update the specific request
      const requests = getMockLeaveRequests();
      const requestIndex = requests.findIndex(req => req.id === id);
      
      if (requestIndex === -1) {
        throw new Error("Leave request not found");
      }
      
      // Update request status
      requests[requestIndex].status = "approved";
      requests[requestIndex].updated_at = new Date().toISOString();
      
      saveMockLeaveRequests(requests);
      
      return requests[requestIndex];
    }
  },
  
  reject: async (id: string) => {
    try {
      // First try the real API
      const response = await api.put(`/leave/reject/${id}`);
      return response.data;
    } catch (error) {
      console.log("Using mock leave request rejection instead");
      
      // Get current user to check if admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Only administrators can reject leave requests");
      }
      
      // Get and update the specific request
      const requests = getMockLeaveRequests();
      const requestIndex = requests.findIndex(req => req.id === id);
      
      if (requestIndex === -1) {
        throw new Error("Leave request not found");
      }
      
      // Update request status
      requests[requestIndex].status = "rejected";
      requests[requestIndex].updated_at = new Date().toISOString();
      
      saveMockLeaveRequests(requests);
      
      return requests[requestIndex];
    }
  },
  
  delete: async (id: string) => {
    try {
      // First try the real API
      const response = await api.delete(`/leave/${id}`);
      return response.data;
    } catch (error) {
      console.log("Using mock leave request deletion instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to delete a leave request");
      }
      
      // Get requests
      const requests = getMockLeaveRequests();
      const requestIndex = requests.findIndex(req => req.id === id);
      
      if (requestIndex === -1) {
        throw new Error("Leave request not found");
      }
      
      const request = requests[requestIndex];
      
      // Check if user owns this request or is admin
      if (request.user_id !== currentUser.id && currentUser.role !== "admin") {
        throw new Error("You can only delete your own leave requests");
      }
      
      // Check if request is still pending (unless admin)
      if (request.status !== "pending" && currentUser.role !== "admin") {
        throw new Error("Only pending requests can be deleted");
      }
      
      // Delete request
      requests.splice(requestIndex, 1);
      saveMockLeaveRequests(requests);
      
      return { success: true };
    }
  },
};

export default api;
