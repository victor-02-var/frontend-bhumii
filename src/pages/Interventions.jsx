import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export const Interventions = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recommendations/priority/urgent').catch(() => null);
      if (res?.data?.data) {
        setRecommendations(res.data.data);
      } else {
        setRecommendations([
          { id: '1', project_name: 'NH-58 Expressway Expansion', priority: 'URGENT', category: 'legal', action: 'Direct District Collector to file expedited counter-affidavit for 4 court stay orders before High Court Bench.', owner: 'State Legal Department', deadline: '2024-10-25', status: 'pending' },
          { id: '2', project_name: 'Subernarekha Hydroelectric Dam', priority: 'URGENT', category: 'compensation', action: 'Release second tranche of compensation funds (₹45 Crore) to District Special Land Acquisition Officer (SLAO).', owner: 'District Collector', deadline: '2024-10-30', status: 'in_progress' },
          { id: '3', project_name: 'Kolkata Metro Extension Line', priority: 'HIGH', category: 'documentation', action: 'Publish Section 19 declaration immediately to prevent statutory Section 11 lapse.', owner: 'District Magistrate', deadline: '2024-11-05', status: 'pending' },
          { id: '4', project_name: 'Western Dedicated Freight Corridor', priority: 'MEDIUM', category: 'rr', action: 'Expedite Gram Sabha public hearing for Rehabilitation & Resettlement (R&R) scheme approval.', owner: 'Sub-Divisional Magistrate (SDM)', deadline: '2024-11-15', status: 'resolved' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/recommendations/${id}/status`, { status: newStatus }).catch(() => null);
      setRecommendations(recommendations.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>सुधारात्मक कार्रवाई एवं निवारक अनुशंसाएं</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Predictive Recommendation Engine Generating Targeted Directives for High-Risk Projects
          </p>
        </div>
      </div>

      {/* Recommendations Matrix */}
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  rec.priority === 'URGENT' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  rec.priority === 'HIGH' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  {rec.priority} PRIORITY
                </span>

                <span className="text-slate-500 text-xs font-bold">| {rec.project_name || 'Project'}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{rec.action}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <span>Owner: <strong className="text-slate-900">{rec.owner}</strong></span>
                <span>Category: <strong className="text-slate-900 capitalize">{rec.category}</strong></span>
                <span>Deadline: <strong className="text-amber-800 font-mono font-bold">{rec.deadline || 'Immediate'}</strong></span>
              </div>
            </div>

            {/* Status Updater Controls */}
            <div className="flex items-center space-x-2 self-start md:self-auto">
              {rec.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(rec.id, 'in_progress')}
                  className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-bold rounded-xl transition shadow-2xs"
                >
                  Mark In Progress
                </button>
              )}

              {rec.status !== 'resolved' ? (
                <button
                  onClick={() => handleStatusUpdate(rec.id, 'resolved')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>RESOLVED</span>
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
