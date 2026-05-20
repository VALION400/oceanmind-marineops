'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  activeVessels: number;
  totalCrew: number;
  operationsInProgress: number;
  pendingReminders: number;
}

interface VesselRow {
  id: string;
  status: string;
}

interface LogRow {
  id: string;
  action: string;
  details: string;
  vessels: { name: string }[] | null;
  created_at: string;
}

interface ReminderRow {
  id: string;
}

interface RecentActivity {
  id: string;
  action: string;
  details: string;
  vessel_name: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeVessels: 0,
    totalCrew: 0,
    operationsInProgress: 0,
    pendingReminders: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [vesselsRes, crewRes, logsRes, remindersRes] = await Promise.all([
        supabase.from('vessels').select('id, status'),
        supabase.from('crew').select('id'),
        supabase.from('operation_logs').select('id, action, details, vessels(name)').order('created_at', { ascending: false }).limit(10),
        supabase.from('reminders').select('id').eq('completed', false),
      ]);

      const vessels = (vesselsRes.data || []) as VesselRow[];
      const logs = (logsRes.data || []) as LogRow[];
      const reminders = (remindersRes.data || []) as ReminderRow[];

      setStats({
        activeVessels: vessels.filter((v) => v.status === 'active').length,
        totalCrew: (crewRes.data || []).length,
        operationsInProgress: vessels.filter((v) => v.status === 'in_progress').length,
        pendingReminders: reminders.length,
      });

      setActivities(
        logs.map((log) => ({
          id: log.id,
          action: log.action,
          details: log.details,
          vessel_name: log.vessels?.[0]?.name || null,
          created_at: log.created_at,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, Captain</h1>
        <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Active Vessels"
          value={stats.activeVessels}
          color="blue"
          icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          label="Crew on Duty"
          value={stats.totalCrew}
          color="cyan"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <StatCard
          label="Operations"
          value={stats.operationsInProgress}
          color="emerald"
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
        <StatCard
          label="Pending Reminders"
          value={stats.pendingReminders}
          color="amber"
          icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          {activities.length === 0 ? (
            <p className="text-slate-400">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.action}</span>
                      {activity.vessel_name && (
                        <span className="text-slate-400"> — {activity.vessel_name}</span>
                      )}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">{activity.details}</p>
                  </div>
                  <span className="text-slate-500 text-xs flex-shrink-0">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600/20 text-blue-400',
    cyan: 'bg-cyan-600/20 text-cyan-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    amber: 'bg-amber-600/20 text-amber-400',
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color] || colorClasses.blue}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
