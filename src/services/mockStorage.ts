
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
