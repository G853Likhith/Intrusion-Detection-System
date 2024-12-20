import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { NetworkActivity, Alert } from '../types';
import { supabase, subscribeToAlerts } from '../lib/supabase';

export default function Dashboard() {
  const [activities, setActivities] = useState<NetworkActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Load initial data
    loadNetworkActivity();
    loadAlerts();

    // Subscribe to real-time alerts
    const subscription = subscribeToAlerts((payload) => {
      setAlerts(prev => [payload.new, ...prev]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadNetworkActivity = async () => {
    const { data } = await supabase
      .from('network_activity')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);
    if (data) setActivities(data);
  };

  const loadAlerts = async () => {
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);
    if (data) setAlerts(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">System Status</h2>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Active monitoring enabled
            </p>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Recent Alerts</h2>
            </div>
            <div className="mt-4 space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}`}>
                    {alert.severity}
                  </span>
                  <p className="ml-2 text-sm text-gray-600">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Network Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Network Activity</h2>
            </div>
            <div className="mt-4 space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${activity.status === 'suspicious' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'blocked' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'}`}>
                    {activity.status}
                  </span>
                  <p className="ml-2 text-sm text-gray-600">
                    {activity.ip_address} - {activity.request_type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}