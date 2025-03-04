
import api from "./apiClient";
import { getMockLeaveRequests, saveMockLeaveRequests, getMockNotifications, saveMockNotifications, getMockAuditLogs, saveMockAuditLogs } from "./mockStorage";
import { authService } from "./authService";

export interface LeaveRequest {
  id?: string;
  user_id?: string;
  user_name?: string;
  leave_type: string;
  start_date: string | Date;
  end_date: string | Date;
  reason?: string;
  status?: string;
  comments?: Comment[];
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  request_id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  user_name: string;
  details: string;
  created_at: string;
}

// Helper function to create audit logs
const createAuditLog = (action: string, entityType: string, entityId: string, details: string) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    throw new Error("You must be logged in to perform this action");
  }
  
  const auditLogs = getMockAuditLogs();
  const newLog: AuditLog = {
    id: `log_${Date.now()}`,
    action,
    entity_type: entityType,
    entity_id: entityId,
    user_id: currentUser.id,
    user_name: currentUser.name,
    details,
    created_at: new Date().toISOString()
  };
  
  auditLogs.push(newLog);
  saveMockAuditLogs(auditLogs);
  
  return newLog;
};

// Helper function to create notifications
const createNotification = (userId: string, title: string, message: string) => {
  const notifications = getMockNotifications();
  const newNotification: Notification = {
    id: `notif_${Date.now()}`,
    user_id: userId,
    title,
    message,
    is_read: false,
    created_at: new Date().toISOString()
  };
  
  notifications.push(newNotification);
  saveMockNotifications(notifications);
  
  return newNotification;
};

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
        comments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      requests.push(newRequest);
      saveMockLeaveRequests(requests);
      
      // Create audit log
      createAuditLog(
        "create", 
        "leave_request", 
        newRequest.id, 
        `Created ${newRequest.leave_type} leave request from ${new Date(newRequest.start_date).toLocaleDateString()} to ${new Date(newRequest.end_date).toLocaleDateString()}`
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
      
      // Create audit log
      createAuditLog(
        "update", 
        "leave_request", 
        updatedRequest.id, 
        `Updated ${updatedRequest.leave_type} leave request from ${new Date(updatedRequest.start_date).toLocaleDateString()} to ${new Date(updatedRequest.end_date).toLocaleDateString()}`
      );
      
      return updatedRequest;
    }
  },
  
  approve: async (id: string, comment?: string) => {
    try {
      // First try the real API
      const response = await api.put(`/leave/approve/${id}`, { comment });
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
      
      // Add comment if provided
      if (comment) {
        if (!requests[requestIndex].comments) {
          requests[requestIndex].comments = [];
        }
        
        requests[requestIndex].comments.push({
          id: `comment_${Date.now()}`,
          request_id: id,
          user_id: currentUser.id,
          user_name: currentUser.name,
          text: comment,
          created_at: new Date().toISOString()
        });
      }
      
      saveMockLeaveRequests(requests);
      
      // Create notification for the request owner
      createNotification(
        requests[requestIndex].user_id,
        "Leave Request Approved",
        `Your ${requests[requestIndex].leave_type} leave request has been approved.`
      );
      
      // Create audit log
      createAuditLog(
        "approve", 
        "leave_request", 
        id, 
        `Approved leave request for ${requests[requestIndex].user_name}`
      );
      
      return requests[requestIndex];
    }
  },
  
  reject: async (id: string, comment?: string) => {
    try {
      // First try the real API
      const response = await api.put(`/leave/reject/${id}`, { comment });
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
      
      // Add comment if provided
      if (comment) {
        if (!requests[requestIndex].comments) {
          requests[requestIndex].comments = [];
        }
        
        requests[requestIndex].comments.push({
          id: `comment_${Date.now()}`,
          request_id: id,
          user_id: currentUser.id,
          user_name: currentUser.name,
          text: comment,
          created_at: new Date().toISOString()
        });
      }
      
      saveMockLeaveRequests(requests);
      
      // Create notification for the request owner
      createNotification(
        requests[requestIndex].user_id,
        "Leave Request Rejected",
        `Your ${requests[requestIndex].leave_type} leave request has been rejected.`
      );
      
      // Create audit log
      createAuditLog(
        "reject", 
        "leave_request", 
        id, 
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
      
      // Create audit log before deletion
      createAuditLog(
        "delete", 
        "leave_request", 
        id, 
        `Deleted ${request.leave_type} leave request for ${request.user_name}`
      );
      
      // Delete request
      requests.splice(requestIndex, 1);
      saveMockLeaveRequests(requests);
      
      return { success: true };
    }
  },
  
  addComment: async (id: string, text: string) => {
    try {
      // First try the real API
      const response = await api.post(`/leave/${id}/comments`, { text });
      return response.data;
    } catch (error) {
      console.log("Using mock comment addition instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to add a comment");
      }
      
      // Get and update the specific request
      const requests = getMockLeaveRequests();
      const requestIndex = requests.findIndex(req => req.id === id);
      
      if (requestIndex === -1) {
        throw new Error("Leave request not found");
      }
      
      // Ensure comments array exists
      if (!requests[requestIndex].comments) {
        requests[requestIndex].comments = [];
      }
      
      // Create new comment
      const newComment = {
        id: `comment_${Date.now()}`,
        request_id: id,
        user_id: currentUser.id,
        user_name: currentUser.name,
        text,
        created_at: new Date().toISOString()
      };
      
      // Add comment to request
      requests[requestIndex].comments.push(newComment);
      saveMockLeaveRequests(requests);
      
      // Create audit log
      createAuditLog(
        "comment", 
        "leave_request", 
        id, 
        `Added comment to leave request for ${requests[requestIndex].user_name}`
      );
      
      return newComment;
    }
  },
  
  getAuditLogs: async () => {
    try {
      // First try the real API
      const response = await api.get("/admin/audit-logs");
      return response.data;
    } catch (error) {
      console.log("Using mock audit logs instead");
      
      // Get current user to check if admin
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("You don't have permission to access audit logs");
      }
      
      // Return all audit logs
      return getMockAuditLogs();
    }
  },
  
  getNotifications: async () => {
    try {
      // First try the real API
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.log("Using mock notifications instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to view notifications");
      }
      
      // Get and filter notifications for current user
      const notifications = getMockNotifications();
      return notifications.filter(notif => notif.user_id === currentUser.id);
    }
  },
  
  markNotificationAsRead: async (id: string) => {
    try {
      // First try the real API
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.log("Using mock notification marking instead");
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to update notifications");
      }
      
      // Get and update the specific notification
      const notifications = getMockNotifications();
      const notificationIndex = notifications.findIndex(notif => notif.id === id);
      
      if (notificationIndex === -1) {
        throw new Error("Notification not found");
      }
      
      // Check if user owns this notification
      if (notifications[notificationIndex].user_id !== currentUser.id) {
        throw new Error("You can only update your own notifications");
      }
      
      // Update notification
      notifications[notificationIndex].is_read = true;
      saveMockNotifications(notifications);
      
      return notifications[notificationIndex];
    }
  }
};
