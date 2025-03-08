
// Types for leave requests
export interface LeaveRequest {
  id: string;
  user_id?: string;
  user_name?: string;
  leave_type: string;
  start_date: string | Date;
  end_date: string | Date;
  reason?: string;
  status: string;
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
