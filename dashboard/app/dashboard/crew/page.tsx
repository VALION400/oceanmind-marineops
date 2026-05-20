'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CrewMember, Vessel } from '@/types/database';

interface CrewWithVessel extends CrewMember {
  vessels?: { name: string };
}

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewWithVessel[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vessel_id: '',
    member_name: '',
    role: '',
    status: 'on_duty',
  });

  async function fetchData() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const [{ data: vesselsData }, { data: crewData }] = await Promise.all([
        supabase.from('vessels').select('*').eq('user_id', userData.user.id),
        supabase
          .from('crew')
          .select(`
            *,
            vessels!inner (
              id,
              name,
              user_id
            )
          `)
          .eq('vessels.user_id', userData.user.id),
      ]);

      setVessels(vesselsData || []);
      setCrew(crewData as unknown as CrewWithVessel[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleAddCrew(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { error } = await supabase.from('crew').insert({
        vessel_id: formData.vessel_id,
        member_name: formData.member_name,
        role: formData.role,
        status: formData.status,
        on_duty_from: formData.status === 'on_duty' ? new Date().toISOString() : null,
      });

      if (error) throw error;

      setFormData({ vessel_id: '', member_name: '', role: '', status: 'on_duty' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error adding crew:', error);
      alert('Failed to add crew member');
    }
  }

  async function updateCrewStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('crew')
        .update({
          status,
          on_duty_from: status === 'on_duty' ? new Date().toISOString() : null,
          on_duty_to: status !== 'on_duty' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating crew:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crew Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Add Crew Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCrew} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.vessel_id}
              onChange={(e) => setFormData({ ...formData, vessel_id: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Vessel</option>
              {vessels.map((vessel) => (
                <option key={vessel.id} value={vessel.id}>
                  {vessel.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={formData.member_name}
              onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
              placeholder="Member name"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Role (e.g., Captain, Engineer)"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="on_duty">On Duty</option>
              <option value="off_duty">Off Duty</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Crew Member
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vessel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {crew.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">{member.member_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.vessels?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      member.status === 'on_duty'
                        ? 'bg-green-100 text-green-800'
                        : member.status === 'off_duty'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {member.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => updateCrewStatus(member.id, 'on_duty')}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    On Duty
                  </button>
                  <button
                    onClick={() => updateCrewStatus(member.id, 'off_duty')}
                    className="text-sm text-yellow-600 hover:text-yellow-800"
                  >
                    Off Duty
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {crew.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No crew members found. Add your first crew member above.
        </div>
      )}
    </div>
  );
}
