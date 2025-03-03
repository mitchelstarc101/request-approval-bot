
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

export default api;
