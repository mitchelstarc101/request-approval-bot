
import api from "../apiClient";
import { getMockLeaveRequests, saveMockLeaveRequests } from "../mockStorage";
import { authService } from "../authService";
import { addAuditLog } from "../reportingService";

export const commentService = {
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
  }
};
