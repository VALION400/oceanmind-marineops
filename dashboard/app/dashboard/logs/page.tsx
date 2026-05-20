'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { OperationLog } from '@/types/database';

interface LogWithVessel extends OperationLog {
  vessels?: { name: string };
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogWithVessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  async function fetchLogs() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      let query = supabase
        .from('operation_logs')
        .select(`
          *,
          vessels (
            name
          )
        `)
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('action', filter);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setLogs(data as unknown as LogWithVessel[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const actions = ['all', 'update_vessel', 'update_crew', 'log_event', 'set_reminder'];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Operation Logs</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {actions.map((action) => (
            <option key={action} value={action}>
              {action === 'all' ? 'All Actions' : action.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vessel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.vessels?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {logs.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No operation logs found.
        </div>
      )}
    </div>
  );
}
