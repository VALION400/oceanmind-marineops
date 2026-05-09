'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Vessel {
  id: string;
  name: string;
  status: string;
  last_updated: string;
}

export default function VesselsPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newVesselName, setNewVesselName] = useState('');
  const [newVesselStatus, setNewVesselStatus] = useState('active');

  useEffect(() => {
    fetchVessels();
  }, []);

  async function fetchVessels() {
    const { data } = await supabase
      .from('vessels')
      .select('*')
      .order('name');
    setVessels((data || []) as Vessel[]);
    setLoading(false);
  }

  async function handleAddVessel() {
    if (!newVesselName.trim()) return;
    await supabase.from('vessels').insert({
      name: newVesselName.trim(),
      status: newVesselStatus,
    });
    setNewVesselName('');
    setNewVesselStatus('active');
    setShowModal(false);
    fetchVessels();
  }

  async function handleUpdateStatus(id: string, status: string) {
    await supabase.from('vessels').update({
      status,
      last_updated: new Date().toISOString(),
    }).eq('id', id);
    fetchVessels();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this vessel?')) return;
    await supabase.from('vessels').delete().eq('id', id);
    fetchVessels();
  }

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    maintenance: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    docked: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    in_progress: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  if (loading) {
    return <div className="p-8 text-white">Loading vessels...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Vessels</h1>
          <p className="text-slate-400 mt-1">Manage your fleet</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Vessel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vessels.map((vessel) => (
          <div key={vessel.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{vessel.name}</h3>
                <p className="text-slate-400 text-sm">Last updated: {new Date(vessel.last_updated).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(vessel.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColors[vessel.status] || statusColors.active}`}>
              {vessel.status.replace('_', ' ')}
            </span>
            <div className="mt-4 flex gap-2">
              <select
                value={vessel.status}
                onChange={(e) => handleUpdateStatus(vessel.id, e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="docked">Docked</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {vessels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No vessels registered yet. Add your first vessel to get started.</p>
        </div>
      )}

      {/* Add Vessel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Add New Vessel</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Vessel Name</label>
                <input
                  type="text"
                  value={newVesselName}
                  onChange={(e) => setNewVesselName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Ocean Pride"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={newVesselStatus}
                  onChange={(e) => setNewVesselStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="docked">Docked</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVessel}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add Vessel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
