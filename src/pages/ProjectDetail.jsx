import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { StageStepper } from '../components/common/StageStepper';
import { RiskBadge } from '../components/common/RiskBadge';
import { ArrowLeft, Calendar, Scale, Landmark, Play } from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`).catch(() => null);
      if (res?.data?.data) {
        setProject(res.data.data);
      } else {
        setProject({
          id: id || '1',
          project_id: 'NH-58-UP-2024',
          project_name: 'NH-58 Expressway Expansion',
          project_type: 'Highway',
          state: 'Uttar Pradesh',
          district: 'Lucknow',
          total_land_area_ha: 145.2,
          num_affected_families: 520,
          current_stage: 'Stage 5: Section 11 Notification',
          section_11_date: '2023-11-15',
          section_11_lapse_date: '2024-11-15',
          compensation_disbursement_pct: 35,
          possession_status_pct: 20,
          rehabilitation_progress_pct: 15,
          num_legal_disputes: 4,
          num_pending_documents: 8,
          court_case_pending: true,
          risk_score: 84,
          risk_category: 'High'
        });
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <div className="p-8 text-center text-slate-500">Loading project detail...</div>;

  return (
    <div className="space-y-6">
      
      {/* Top Nav & Header */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slate-900">{project.project_name}</h1>
            <RiskBadge category={project.risk_category} score={project.risk_score} />
          </div>
          <p className="text-xs text-slate-500 font-mono font-bold">ID: {project.project_id} | {project.district}, {project.state}</p>
        </div>
      </div>

      {/* Statutory LARR 10-Stage Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Statutory LARR Lifecycle Stage Timeline
        </h3>
        <StageStepper currentStage={project.current_stage} />
      </div>

      {/* 3-Column Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Statutory Dates & Milestones */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Statutory Notification Dates</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Section 11 Notification:</span>
              <span className="font-mono font-bold text-slate-800">{project.section_11_date || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Section 11 Statutory Lapse:</span>
              <span className="font-mono text-rose-700 font-black">{project.section_11_lapse_date || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Total Land Area:</span>
              <span className="font-bold text-slate-800">{project.total_land_area_ha} Ha</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Affected Families:</span>
              <span className="font-bold text-slate-800">{project.num_affected_families}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Progress & Disbursement Gauges */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>Progress Gauges</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Compensation Disbursement</span>
                <span className="font-bold text-amber-800">{project.compensation_disbursement_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-amber-600 h-full" style={{ width: `${project.compensation_disbursement_pct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Possession Taken</span>
                <span className="font-bold text-emerald-800">{project.possession_status_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-emerald-600 h-full" style={{ width: `${project.possession_status_pct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Rehabilitation & Resettlement</span>
                <span className="font-bold text-blue-800">{project.rehabilitation_progress_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-blue-600 h-full" style={{ width: `${project.rehabilitation_progress_pct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Legal Disputes & Complexities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Scale className="w-4 h-4 text-rose-600" />
            <span>Legal Complexity Drivers</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Active Court Cases:</span>
              <span className="font-bold text-rose-700">{project.num_legal_disputes || 0} Cases</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Pending Clearances:</span>
              <span className="font-bold text-slate-800">{project.num_pending_documents || 0} Docs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Court Stay Order Active:</span>
              <span className={`font-bold ${project.court_case_pending ? 'text-rose-700' : 'text-emerald-700'}`}>
                {project.court_case_pending ? 'YES (Active Stay)' : 'NO'}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-1">
            <button 
              onClick={() => navigate(`/simulator?projectId=${project.id}`)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch What-If Simulation Engine</span>
            </button>

            <button 
              onClick={() => navigate('/analytics')}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition"
            >
              <span>View Predictive Analytics</span>
            </button>
          </div>
        </div>


      </div>

    </div>
  );
};
