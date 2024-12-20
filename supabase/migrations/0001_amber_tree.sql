/*
  # Initial Schema Setup for IDS

  1. New Tables
    - users: Store user information
    - network_activity: Log all network activities
    - alerts: Store security alerts
    - audit_logs: Track system changes

  2. Security
    - Enable RLS on all tables
    - Set up policies for data access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Network Activity table
CREATE TABLE IF NOT EXISTS network_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  ip_address text NOT NULL,
  user_agent text,
  request_type text NOT NULL,
  endpoint text NOT NULL,
  status text NOT NULL DEFAULT 'normal',
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  severity text NOT NULL,
  message text NOT NULL,
  activity_id uuid REFERENCES network_activity(id),
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  user_id uuid REFERENCES users(id),
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view network activity"
  ON network_activity
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );