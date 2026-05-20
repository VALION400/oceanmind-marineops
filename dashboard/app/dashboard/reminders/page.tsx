'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Reminder, Vessel } from '@/types/database';

interface ReminderWithVessel extends Reminder {
  vessels?: { name: string };
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderWithVessel[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vessel_id: '',
    message: '',
    minutes: '60',
  });

  async function fetchData() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const [{ data: vesselsData }, { data: remindersData }] = await Promise.all([
        supabase.from('vessels').select('*').eq('user_id', userData.user.id),
        supabase
          .from('reminders')
          .select(`
            *,
            vessels (
              name
            )
          `)
          .eq('user_id', userData.user.id)
          .order('scheduled_at', { ascending: true }),
      ]);

      setVessels(vesselsData || []);
      setReminders(remindersData as unknown as ReminderWithVessel[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleCreateReminder(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const scheduledAt = new Date(Date.now() + parseInt(formData.minutes) * 60 * 1000).toISOString();

      const { error } = await supabase.from('reminders').insert({
        user_id: userData.user.id,
        vessel_id: formData.vessel_id || null,
        reminder_type: 'message',
        scheduled_at: scheduledAt,
        message: formData.message,
        completed: false,
      });

      if (error) throw error;

      setFormData({ vessel_id: '', message: '', minutes: '60' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating reminder:', error);
      alert('Failed to create reminder');
    }
  }

  async function deleteReminder(id: string) {
    try {
      const { error } = await supabase.from('reminders').delete().eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const activeReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Create Reminder'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateReminder} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.vessel_id}
              onChange={(e) => setFormData({ ...formData, vessel_id: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Vessels</option>
              {vessels.map((vessel) => (
                <option key={vessel.id} value={vessel.id}>
                  {vessel.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={formData.minutes}
              onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
              placeholder="Minutes from now"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />

            <input
              type="text"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Reminder message"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Reminder
          </button>
        </form>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Reminders ({activeReminders.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeReminders.map((reminder) => (
              <div key={reminder.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-gray-900 font-medium">{reminder.message}</p>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Scheduled: {new Date(reminder.scheduled_at).toLocaleString()}
                </p>
                {(reminder).vessels?.name && (
                  <p className="text-sm text-blue-600">Vessel: {(reminder).vessels.name}</p>
                )}
              </div>
            ))}
          </div>
          {activeReminders.length === 0 && (
            <p className="text-gray-500 text-center py-6">No active reminders</p>
          )}
        </div>

        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed ({completedReminders.length})</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {completedReminders.slice(0, 10).map((reminder) => (
                <div key={reminder.id} className="text-sm text-gray-600">
                  <span className="line-through">{reminder.message}</span>
                  <span className="ml-2 text-gray-400">
                    - {new Date(reminder.scheduled_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
