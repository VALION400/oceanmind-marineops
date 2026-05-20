'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/database';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      setUser(data as User);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-900">{user?.name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="mt-1 text-gray-900">{user?.phone_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">WhatsApp Integration</h2>
          <p className="text-sm text-blue-800">
            Your account is linked to WhatsApp number: <strong>{user?.phone_number}</strong>
          </p>
          <p className="text-sm text-blue-700 mt-2">
            Send messages to your Twilio WhatsApp number to manage vessels, crew, and operations.
          </p>
        </div>
      </div>
    </div>
  );
}
