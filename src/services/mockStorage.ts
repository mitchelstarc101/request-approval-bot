
// Mock Users Storage
export const getMockUsers = () => {
  const users = localStorage.getItem('mock_users');
  return users ? JSON.parse(users) : [];
};

export const saveMockUsers = (users: any[]) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Mock Leave Requests Storage
export const getMockLeaveRequests = () => {
  const requests = localStorage.getItem('mock_leave_requests');
  return requests ? JSON.parse(requests) : [];
};

export const saveMockLeaveRequests = (requests: any[]) => {
  localStorage.setItem('mock_leave_requests', JSON.stringify(requests));
};

// Mock Notifications Storage
export const getMockNotifications = () => {
  const notifications = localStorage.getItem('mock_notifications');
  return notifications ? JSON.parse(notifications) : [];
};

export const saveMockNotifications = (notifications: any[]) => {
  localStorage.setItem('mock_notifications', JSON.stringify(notifications));
};

// Mock Audit Logs Storage
export const getMockAuditLogs = () => {
  const logs = localStorage.getItem('mock_audit_logs');
  return logs ? JSON.parse(logs) : [];
};

export const saveMockAuditLogs = (logs: any[]) => {
  localStorage.setItem('mock_audit_logs', JSON.stringify(logs));
};
