'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Vessel } from '@/types/database';

export default function VesselsPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newVesselName, setNewVesselName] = useState('');

  useEffect(() => {
    fetchVessels();
  }, []);

  async function fetchVessels() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('vessels')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVessels(data || []);
    } catch (error) {
      console.error('Error fetching vessels:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateVessel(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { error } = await supabase.from('vessels').insert({
        name: newVesselName,
        user_id: userData.user.id,
        status: 'active',
      });

      if (error) throw error;

      setNewVesselName('');
      setShowForm(false);
      fetchVessels();
    } catch (error) {
      console.error('Error creating vessel:', error);
      alert('Failed to create vessel');
    }
  }

  async function updateVesselStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('vessels')
        .update({ status, last_updated: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchVessels();
    } catch (error) {
      console.error('Error updating vessel:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vessels</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Add Vessel'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateVessel} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-4">
            <input
              type="text"
              value={newVesselName}
              onChange={(e) => setNewVesselName(e.target.value)}
              placeholder="Vessel name"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vessels.map((vessel) => (
          <div key={vessel.id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{vessel.name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  vessel.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : vessel.status === 'maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {vessel.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Last updated: {new Date(vessel.last_updated).toLocaleDateString()}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => updateVesselStatus(vessel.id, 'active')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Active
              </button>
              <button
                onClick={() => updateVesselStatus(vessel.id, 'maintenance')}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Maintenance
              </button>
              <button
                onClick={() => updateVesselStatus(vessel.id, 'inactive')}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Inactive
              </button>
            </div>
          </div>
        ))}
      </div>

      {vessels.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No vessels found. Add your first vessel above.
        </div>
      )}
    </div>
  );
}
