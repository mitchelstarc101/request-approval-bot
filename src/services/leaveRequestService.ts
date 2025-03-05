import api from "./apiClient";
import { getMockLeaveRequests, saveMockLeaveRequests } from "./mockStorage";
import { authService } from "./authService";
import { addAuditLog } from "./reportingService";

export interface LeaveRequest {
  id: string; // Changed from optional to required
  user_id?: string;
  user_name?: string;
  leave_type: string;
  start_date: string | Date;
  end_date: string | Date;
  reason?: string;
  status: string; // Changed from optional to required
  comments?: Comment[];
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

export const leaveRequestService = {
  create: async (leaveData: LeaveRequest) => {
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
      
      // Add audit log
      addAuditLog(
        'create',
        newRequest.id,
        'leave_request',
        currentUser.id,
        currentUser.name,
        `Created ${leaveData.leave_type} leave request from ${new Date(leaveData.start_date).toLocaleDateString()} to ${new Date(leaveData.end_date).toLocaleDateString()}`
      );
      
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
  
  update: async (id: string, leaveData: LeaveRequest) => {
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
      
      // Add audit log
      addAuditLog(
        'modify',
        id,
        'leave_request',
        currentUser.id,
        currentUser.name,
        `Updated ${leaveData.leave_type} leave request from ${new Date(leaveData.start_date).toLocaleDateString()} to ${new Date(leaveData.end_date).toLocaleDateString()}`
      );
      
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
      const deletedRequest = requests[requestIndex];
      requests.splice(requestIndex, 1);
      saveMockLeaveRequests(requests);
      
      // Add audit log
      addAuditLog(
        'delete',
        id,
        'leave_request',
        currentUser.id,
        currentUser.name,
        `Deleted ${deletedRequest.leave_type} leave request for ${deletedRequest.user_name}`
      );
      
      return { success: true };
    }
  },
  
  addComment: async (leaveId: string, commentText: string) => {
    try {
      // First try the real API
      const response = await api.post(`/leave/${leaveId}/comment`, { text: commentText });
      return response.data;
    } catch (error) {
      console.log("Using mock comment addition instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to add a comment");
      }
      
      // Get requests
      const requests = getMockLeaveRequests();
      const requestIndex = requests.findIndex(req => req.id === leaveId);
      
      if (requestIndex === -1) {
        throw new Error("Leave request not found");
      }
      
      // Create new comment
      const newComment = {
        id: `comment_${Date.now()}`,
        user_id: currentUser.id,
        user_name: currentUser.name,
        text: commentText,
        created_at: new Date().toISOString()
      };
      
      // Add comment to request
      if (!requests[requestIndex].comments) {
        requests[requestIndex].comments = [];
      }
      
      requests[requestIndex].comments.push(newComment);
      requests[requestIndex].updated_at = new Date().toISOString();
      
      saveMockLeaveRequests(requests);
      
      // Add audit log
      addAuditLog(
        'comment',
        leaveId,
        'leave_request',
        currentUser.id,
        currentUser.name,
        `Added comment to leave request for ${requests[requestIndex].user_name}`
      );
      
      return newComment;
    }
  },
  
  // Add any additional methods you need here
};
