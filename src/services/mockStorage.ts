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

// Initialize mock data if not present
export const initializeMockData = () => {
  console.log("Initializing mock data");
  // Always clear existing mock data first for debugging
  localStorage.removeItem('mock_users');
  
  // Check if mock users exist
  if (!localStorage.getItem('mock_users')) {
    console.log("Creating initial mock users");
    const initialUsers = [
      {
        id: 'user_admin',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        password: 'password123'
      },
      {
        id: 'user_employee',
        name: 'Employee User',
        email: 'employee@example.com',
        role: 'user',
        password: 'password123'
      }
    ];
    
    saveMockUsers(initialUsers);
    console.log("Mock users created:", initialUsers);
  }
  
  // Check if mock leave requests exist
  if (!localStorage.getItem('mock_leave_requests')) {
    const now = new Date();
    
    // Sample past date (two weeks ago)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);
    
    // Sample future date (next week)
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    // Sample end date (next week + 3 days)
    const nextWeekPlus3 = new Date();
    nextWeekPlus3.setDate(now.getDate() + 10);
    
    const initialRequests = [
      {
        id: 'leave_1',
        user_id: 'user_employee',
        user_name: 'Employee User',
        leave_type: 'vacation',
        start_date: nextWeek.toISOString(),
        end_date: nextWeekPlus3.toISOString(),
        reason: 'Annual family vacation',
        status: 'pending',
        comments: [],
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'leave_2',
        user_id: 'user_employee',
        user_name: 'Employee User',
        leave_type: 'sick',
        start_date: twoWeeksAgo.toISOString(),
        end_date: twoWeeksAgo.toISOString(),
        reason: 'Doctor appointment',
        status: 'approved',
        comments: [
          {
            id: 'comment_1',
            user_id: 'user_admin',
            user_name: 'Admin User',
            text: 'Approved as requested. Get well soon!',
            created_at: twoWeeksAgo.toISOString()
          }
        ],
        created_at: twoWeeksAgo.toISOString(),
        updated_at: twoWeeksAgo.toISOString()
      }
    ];
    
    saveMockLeaveRequests(initialRequests);
  }
};

// Force initialize mock data immediately
initializeMockData();
