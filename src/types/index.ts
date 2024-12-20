export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface NetworkActivity {
  id: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  request_type: string;
  endpoint: string;
  status: 'normal' | 'suspicious' | 'blocked';
  user_id?: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  activity_id: string;
  status: 'new' | 'acknowledged' | 'resolved';
}