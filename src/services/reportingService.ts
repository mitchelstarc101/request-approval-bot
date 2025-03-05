
import { getMockLeaveRequests } from "./mockStorage";
import { LeaveRequest } from "./leaveRequestService";

// Types for reporting
export interface LeaveReport {
  totalRequests: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  byType: Record<string, number>;
  averageDuration: number;
  monthlyDistribution: Record<string, number>;
}

export interface AuditLog {
  id: string;
  action: 'approve' | 'reject' | 'modify' | 'create' | 'delete' | 'comment';
  targetId: string;
  targetType: 'leave_request' | 'user';
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
}

// Get mock audit logs from localStorage
export const getMockAuditLogs = (): AuditLog[] => {
  const logs = localStorage.getItem('mock_audit_logs');
  return logs ? JSON.parse(logs) : [];
};

// Save mock audit logs to localStorage
export const saveMockAuditLogs = (logs: AuditLog[]): void => {
  localStorage.setItem('mock_audit_logs', JSON.stringify(logs));
};

// Initialize audit logs if they don't exist
export const initializeAuditLogs = (): void => {
  if (!localStorage.getItem('mock_audit_logs')) {
    // Create empty array for logs
    saveMockAuditLogs([]);
  }
};

// Add a new audit log entry
export const addAuditLog = (
  action: AuditLog['action'],
  targetId: string,
  targetType: AuditLog['targetType'],
  userId: string,
  userName: string,
  details: string
): AuditLog => {
  const logs = getMockAuditLogs();
  
  const newLog: AuditLog = {
    id: `log_${Date.now()}`,
    action,
    targetId,
    targetType,
    userId,
    userName,
    details,
    timestamp: new Date().toISOString()
  };
  
  logs.unshift(newLog); // Add to beginning of array
  saveMockAuditLogs(logs);
  
  return newLog;
};

// Generate leave reports based on the leave requests
export const generateLeaveReport = (): LeaveReport => {
  const requests = getMockLeaveRequests();
  
  // Initialize report structure
  const report: LeaveReport = {
    totalRequests: requests.length,
    byStatus: {
      pending: 0,
      approved: 0,
      rejected: 0
    },
    byType: {},
    averageDuration: 0,
    monthlyDistribution: {}
  };
  
  let totalDuration = 0;
  
  // Process each request to build the report
  requests.forEach((request: LeaveRequest) => {
    // Count by status
    report.byStatus[request.status as keyof typeof report.byStatus]++;
    
    // Count by leave type
    if (!report.byType[request.leave_type]) {
      report.byType[request.leave_type] = 0;
    }
    report.byType[request.leave_type]++;
    
    // Calculate duration
    const startDate = new Date(request.start_date);
    const endDate = new Date(request.end_date);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    totalDuration += duration;
    
    // Group by month
    const month = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!report.monthlyDistribution[month]) {
      report.monthlyDistribution[month] = 0;
    }
    report.monthlyDistribution[month]++;
  });
  
  // Calculate average duration
  report.averageDuration = requests.length > 0 ? totalDuration / requests.length : 0;
  
  return report;
};

// Get employee leave history
export const getEmployeeLeaveHistory = (userId: string): LeaveRequest[] => {
  const requests = getMockLeaveRequests();
  return requests.filter(request => request.user_id === userId);
};

// Get audit logs with filtering options
export const getAuditLogs = (options?: {
  action?: AuditLog['action'];
  userId?: string;
  targetType?: AuditLog['targetType'];
  startDate?: Date;
  endDate?: Date;
}): AuditLog[] => {
  let logs = getMockAuditLogs();
  
  if (options) {
    // Filter by action
    if (options.action) {
      logs = logs.filter(log => log.action === options.action);
    }
    
    // Filter by user ID
    if (options.userId) {
      logs = logs.filter(log => log.userId === options.userId);
    }
    
    // Filter by target type
    if (options.targetType) {
      logs = logs.filter(log => log.targetType === options.targetType);
    }
    
    // Filter by date range
    if (options.startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= options.startDate);
    }
    
    if (options.endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= options.endDate);
    }
  }
  
  return logs;
};

// Initialize audit logs when the module is loaded
initializeAuditLogs();
