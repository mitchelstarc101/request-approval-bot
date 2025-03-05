
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
    
    // Additional dates for more realistic reports
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
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
      },
      // Additional leave requests for better data visualization
      {
        id: 'leave_3',
        user_id: 'user_employee',
        user_name: 'Employee User',
        leave_type: 'personal',
        start_date: threeMonthsAgo.toISOString(),
        end_date: threeMonthsAgo.toISOString(),
        reason: 'Personal matters',
        status: 'approved',
        comments: [],
        created_at: threeMonthsAgo.toISOString(),
        updated_at: threeMonthsAgo.toISOString()
      },
      {
        id: 'leave_4',
        user_id: 'user_employee',
        user_name: 'Employee User',
        leave_type: 'vacation',
        start_date: twoMonthsAgo.toISOString(),
        end_date: twoMonthsAgo.toISOString(),
        reason: 'Weekend getaway',
        status: 'rejected',
        comments: [
          {
            id: 'comment_2',
            user_id: 'user_admin',
            user_name: 'Admin User',
            text: 'Conflicting with project deadline',
            created_at: twoMonthsAgo.toISOString()
          }
        ],
        created_at: twoMonthsAgo.toISOString(),
        updated_at: twoMonthsAgo.toISOString()
      },
      {
        id: 'leave_5',
        user_id: 'user_employee',
        user_name: 'Employee User',
        leave_type: 'sick',
        start_date: oneMonthAgo.toISOString(),
        end_date: oneMonthAgo.toISOString(),
        reason: 'Flu',
        status: 'approved',
        comments: [],
        created_at: oneMonthAgo.toISOString(),
        updated_at: oneMonthAgo.toISOString()
      }
    ];
    
    saveMockLeaveRequests(initialRequests);
    
    // Also create some initial audit logs
    const initialLogs = [
      {
        id: `log_${Date.now() - 5000}`,
        action: 'approve',
        targetId: 'leave_2',
        targetType: 'leave_request',
        userId: 'user_admin',
        userName: 'Admin User',
        details: 'Approved sick leave request for Employee User',
        timestamp: twoWeeksAgo.toISOString()
      },
      {
        id: `log_${Date.now() - 4000}`,
        action: 'comment',
        targetId: 'leave_2',
        targetType: 'leave_request',
        userId: 'user_admin',
        userName: 'Admin User',
        details: 'Added comment to leave request for Employee User',
        timestamp: twoWeeksAgo.toISOString()
      },
      {
        id: `log_${Date.now() - 3000}`,
        action: 'approve',
        targetId: 'leave_3',
        targetType: 'leave_request',
        userId: 'user_admin',
        userName: 'Admin User',
        details: 'Approved personal leave request for Employee User',
        timestamp: threeMonthsAgo.toISOString()
      },
      {
        id: `log_${Date.now() - 2000}`,
        action: 'reject',
        targetId: 'leave_4',
        targetType: 'leave_request',
        userId: 'user_admin',
        userName: 'Admin User',
        details: 'Rejected vacation leave request for Employee User',
        timestamp: twoMonthsAgo.toISOString()
      },
      {
        id: `log_${Date.now() - 1000}`,
        action: 'approve',
        targetId: 'leave_5',
        targetType: 'leave_request',
        userId: 'user_admin',
        userName: 'Admin User',
        details: 'Approved sick leave request for Employee User',
        timestamp: oneMonthAgo.toISOString()
      }
    ];
    
    localStorage.setItem('mock_audit_logs', JSON.stringify(initialLogs));
  }
};

// Force initialize mock data immediately
initializeMockData();
