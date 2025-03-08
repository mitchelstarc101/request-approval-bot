
import { LeaveRequest, Comment } from "../types/leaveTypes";
import { coreLeaveService } from "./coreLeaveService";
import { adminLeaveService } from "./adminLeaveService";
import { commentService } from "./commentService";

// Re-export types
export type { LeaveRequest, Comment };

// Combine all leave-related services into a single service
export const leaveRequestService = {
  // Core leave request operations
  create: coreLeaveService.create,
  getMyRequests: coreLeaveService.getMyRequests,
  getAllRequests: coreLeaveService.getAllRequests,
  update: coreLeaveService.update,
  delete: coreLeaveService.delete,
  
  // Admin operations
  approve: adminLeaveService.approve,
  reject: adminLeaveService.reject,
  
  // Comment operations
  addComment: commentService.addComment
};
