import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { Search, Plus, Filter, FileSpreadsheet, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    project_id: `NH-${Math.floor(Math.random() * 90 + 10)}-UP-2024`,
    project_name: '',
    project_type: 'Highway',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    total_land_area_ha: 120.5,
    num_affected_families: 450,
    current_stage: 'Stage 3: Section 4 Preliminary Notification'
  });

  useEffect(() => {
    fetchProjects();
  }, [stageFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects', { params: { stage: stageFilter } }).catch(() => null);
      if (res?.data?.data) {
        setProjects(res.data.data);
      } else {
        setProjects([
          { id: '1', project_id: 'NH-58-UP-2024', project_name: 'NH-58 Expressway Expansion', project_type: 'Highway', state: 'Uttar Pradesh', district: 'Lucknow', current_stage: 'Stage 5: Section 11 Notification', compensation_disbursement_pct: 35, is_delayed: true, risk_score: 84, risk_category: 'High' },
          { id: '2', project_name: 'Western Freight Corridor Phase 2', project_id: 'WFC-MH-2024', project_type: 'Railway', state: 'Maharashtra', district: 'Thane', current_stage: 'Stage 7: Section 19 Declaration', compensation_disbursement_pct: 68, is_delayed: false, risk_score: 42, risk_category: 'Medium' },
          { id: '3', project_name: 'Subernarekha Hydroelectric Dam', project_id: 'DAM-JH-2024', project_type: 'Dam', state: 'Jharkhand', district: 'Ranchi', current_stage: 'Stage 3: Section 4 Notification', compensation_disbursement_pct: 12, is_delayed: true, risk_score: 91, risk_category: 'Critical' },
          { id: '4', project_name: 'Dholera Industrial Node Land', project_id: 'IND-GJ-2024', project_type: 'Industrial', state: 'Gujarat', district: 'Ahmedabad', current_stage: 'Stage 9: Possession', compensation_disbursement_pct: 95, is_delayed: false, risk_score: 18, risk_category: 'Low' },
          { id: '5', project_name: 'Kolkata Metro Extension Line', project_id: 'RRL-WB-2024', project_type: 'Urban', state: 'West Bengal', district: 'Kolkata', current_stage: 'Stage 2: SIA & Hearing', compensation_disbursement_pct: 20, is_delayed: true, risk_score: 76, risk_category: 'High' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData).catch(() => null);
      setShowCreateModal(false);
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.project_name.toLowerCase().includes(search.toLowerCase()) ||
    p.project_id.toLowerCase().includes(search.toLowerCase()) ||
    p.district.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <span>भूमि अधिग्रहण परियोजना निर्देशिका</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-mono font-bold">Projects Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Master Repository of Statutory LARR Land Acquisition Projects Across India
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name, ID, or district..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 font-semibold focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All LARR Stages</option>
            <option value="Stage 0: Pre-Notification">Stage 0: Pre-Notification</option>
            <option value="Stage 2: SIA & Public Hearing">Stage 2: SIA & Hearing</option>
            <option value="Stage 5: Section 11 Notification">Stage 5: Section 11</option>
            <option value="Stage 7: Section 19 Declaration">Stage 7: Section 19</option>
            <option value="Stage 9: Possession">Stage 9: Possession</option>
          </select>
        </div>

      </div>

      {/* Projects Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Project ID & Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">State / District</th>
                <th className="py-3.5 px-4">Current LARR Stage</th>
                <th className="py-3.5 px-4">Disbursement %</th>
                <th className="py-3.5 px-4">Risk Category</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{p.project_name}</p>
                    <p className="text-[10px] font-mono text-amber-800 font-bold">{p.project_id}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200">
                      {p.project_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{p.district}</p>
                    <p className="text-[10px] text-slate-500">{p.state}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-semibold">{p.current_stage}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full ${p.compensation_disbursement_pct >= 70 ? 'bg-emerald-600' : p.compensation_disbursement_pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${p.compensation_disbursement_pct || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-bold">{p.compensation_disbursement_pct || 0}%</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge category={p.risk_category} score={p.risk_score} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="inline-flex items-center space-x-1 text-xs text-amber-800 hover:text-amber-900 font-bold bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition border border-amber-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Create New Land Acquisition Project</h3>
            
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="e.g. NH-24 Bypass Highway"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
