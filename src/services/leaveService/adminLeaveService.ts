
import api from "../apiClient";
import { getMockLeaveRequests, saveMockLeaveRequests } from "../mockStorage";
import { authService } from "../authService";
import { addAuditLog } from "../reportingService";

export const adminLeaveService = {
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
      
      // Add audit log
      addAuditLog(
        'approve',
        id,
        'leave_request',
        currentUser.id,
        currentUser.name,
        `Approved leave request for ${requests[requestIndex].user_name}`
      );
      
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
      
      // Add audit log
      addAuditLog(
        'reject',
        id,
        'leave_request',
        currentUser.id,
        currentUser.name,
        `Rejected leave request for ${requests[requestIndex].user_name}`
      );
      
      return requests[requestIndex];
    }
  }
};
