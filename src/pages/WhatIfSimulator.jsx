import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { 
  Sliders, 
  TrendingDown, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Building2, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const WhatIfSimulator = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId') || '';

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Intervention Sliders State
  const [compensationBoost, setCompensationBoost] = useState(25);
  const [disputesResolved, setDisputesResolved] = useState(2);
  const [slaoStaffAdded, setSlaoStaffAdded] = useState(3);
  const [stageAcceleration, setStageAcceleration] = useState(30);

  // Simulation Results State
  const [simResults, setSimResults] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [directiveIssued, setDirectiveIssued] = useState(false);

  // Load project list on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Run simulation when project or sliders change
  useEffect(() => {
    runSimulation();
  }, [selectedProjectId, compensationBoost, disputesResolved, slaoStaffAdded, stageAcceleration]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects?limit=30').catch(() => null);
      if (res?.data?.data && res.data.data.length > 0) {
        setProjects(res.data.data);
        if (!selectedProjectId) {
          setSelectedProjectId(res.data.data[0].id);
          setCurrentProject(res.data.data[0]);
        } else {
          const found = res.data.data.find(p => p.id === selectedProjectId);
          if (found) setCurrentProject(found);
        }
      } else {
        // Fallback demo projects
        const fallbackList = [
          {
            id: '1',
            project_code: 'NH-58-UP',
            project_name: 'NH-58 Delhi-Dehradun Expressway Expansion',
            state: 'Uttar Pradesh',
            district: 'Muzaffarnagar',
            compensation_disbursement_pct: 35,
            num_legal_disputes: 4,
            court_case_pending: true,
            compensation_budget_crore: 85.0,
            current_stage: 'Stage 5: Section 11 Notification'
          },
          {
            id: '2',
            project_code: 'DFCCIL-W-04',
            project_name: 'Western Dedicated Freight Corridor (Sector 4)',
            state: 'Gujarat',
            district: 'Vadodara',
            compensation_disbursement_pct: 48,
            num_legal_disputes: 2,
            court_case_pending: true,
            compensation_budget_crore: 140.0,
            current_stage: 'Stage 6: Section 15 Hearing'
          },
          {
            id: '3',
            project_code: 'MRTS-BLR-PH2',
            project_name: 'Bengaluru Metro Line Extension Phase 2',
            state: 'Karnataka',
            district: 'Bengaluru Urban',
            compensation_disbursement_pct: 20,
            num_legal_disputes: 6,
            court_case_pending: true,
            compensation_budget_crore: 210.0,
            current_stage: 'Stage 4: SIA Report Approval'
          }
        ];
        setProjects(fallbackList);
        setSelectedProjectId(fallbackList[0].id);
        setCurrentProject(fallbackList[0]);
      }
    } catch (err) {
      console.error('Error fetching projects for simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (e) => {
    const pId = e.target.value;
    setSelectedProjectId(pId);
    const found = projects.find(p => p.id === pId);
    if (found) {
      setCurrentProject(found);
      // Reset sliders to default sample values
      setCompensationBoost(Math.min(40, 100 - (found.compensation_disbursement_pct || 30)));
      setDisputesResolved(Math.min(found.num_legal_disputes || 2, 2));
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    setDirectiveIssued(false);
    try {
      const payload = {
        projectId: selectedProjectId,
        interventions: {
          compensationBoostPct: compensationBoost,
          disputesResolved: disputesResolved,
          slaoStaffAdded: slaoStaffAdded,
          stageAccelerationDays: stageAcceleration
        }
      };

      const res = await api.post('/predictions/simulate', payload).catch(() => null);
      if (res?.data?.data) {
        setSimResults(res.data.data);
      } else {
        // Fallback math computation if backend fails
        const baseRisk = currentProject ? (100 - (currentProject.compensation_disbursement_pct || 30) * 0.5 + (currentProject.num_legal_disputes || 3) * 8) : 74;
        const clampedBaseRisk = Math.min(95, Math.max(40, baseRisk));
        const riskDelta = Math.min(clampedBaseRisk - 15, compensationBoost * 0.45 + disputesResolved * 9.5 + slaoStaffAdded * 4.2 + stageAcceleration * 0.3);
        const newRisk = Math.max(12, clampedBaseRisk - riskDelta);

        setSimResults({
          original: { riskScore: parseFloat(clampedBaseRisk.toFixed(1)), riskCategory: clampedBaseRisk > 75 ? 'Critical' : 'High' },
          simulated: { riskScore: parseFloat(newRisk.toFixed(1)), riskCategory: newRisk < 35 ? 'Low' : newRisk < 55 ? 'Medium' : 'High' },
          metrics: {
            riskScoreBefore: parseFloat(clampedBaseRisk.toFixed(1)),
            riskScoreAfter: parseFloat(newRisk.toFixed(1)),
            riskDelta: parseFloat(riskDelta.toFixed(1)),
            projectedDaysSaved: Math.round(riskDelta * 2.6 + slaoStaffAdded * 10),
            projectedCostSavedCrore: parseFloat((riskDelta * 0.18 * (currentProject?.compensation_budget_crore || 60) / 100).toFixed(2))
          }
        });
      }
    } catch (err) {
      console.error('Simulation calculation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  const resetSliders = () => {
    setCompensationBoost(20);
    setDisputesResolved(1);
    setSlaoStaffAdded(2);
    setStageAcceleration(15);
  };

  const handleIssueDirective = () => {
    setDirectiveIssued(true);
    setTimeout(() => {
      setDirectiveIssued(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl text-indigo-300">
                <Sliders className="w-6 h-6" />
              </span>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  SIH 2026 Innovation Engine
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
                  LandSight What-If Policy & Resource Simulator
                </h1>
              </div>
            </div>
            <p className="text-slate-300 text-xs max-w-3xl leading-relaxed mt-1 font-medium">
              Simulate targeted administrative, legal, and financial interventions in real-time. Calculate projected delay probability reduction, schedule compression, and cost-escalation savings before deploying official directives.
            </p>
          </div>

          {/* Project Selector Dropdown */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex flex-col min-w-[280px]">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Target Infrastructure Project</span>
            </label>
            <select
              value={selectedProjectId}
              onChange={handleProjectSelect}
              className="bg-slate-900 text-white font-bold text-xs p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name} ({p.district || p.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Sliders (Left) vs Real-Time Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Interventions Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Intervention Control Levers</span>
              </h2>
              <p className="text-xs text-slate-500">Adjust policy parameters to run live simulation</p>
            </div>
            <button
              onClick={resetSliders}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition text-xs flex items-center space-x-1 font-bold"
              title="Reset sliders"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Compensation Disbursement Boost */}
          <div className="space-y-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>Compensation Disbursement Boost</span>
              </span>
              <span className="font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full font-mono">
                +{compensationBoost}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={compensationBoost}
              onChange={(e) => setCompensationBoost(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>+0% (Current: {currentProject?.compensation_disbursement_pct || 35}%)</span>
              <span>+50% Target</span>
            </div>
          </div>

          {/* Slider 2: Legal Disputes Resolution */}
          <div className="space-y-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Legal Court Stay Order Resolution</span>
              </span>
              <span className="font-black text-rose-700 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full font-mono">
                Resolve {disputesResolved} Case{disputesResolved !== 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(4, currentProject?.num_legal_disputes || 4)}
              step="1"
              value={disputesResolved}
              onChange={(e) => setDisputesResolved(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>0 Cases</span>
              <span>Max ({currentProject?.num_legal_disputes || 4} Pending Cases)</span>
            </div>
          </div>

          {/* Slider 3: SLAO Field Staff Allocation */}
          <div className="space-y-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Deploy Extra Field Officers (SLAO)</span>
              </span>
              <span className="font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full font-mono">
                +{slaoStaffAdded} Officer{slaoStaffAdded !== 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={slaoStaffAdded}
              onChange={(e) => setSlaoStaffAdded(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>Standard Staff</span>
              <span>+5 Additional SLAO Teams</span>
            </div>
          </div>

          {/* Slider 4: Administrative Hearing Fast-Tracking */}
          <div className="space-y-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Section 11/15 Hearing Acceleration</span>
              </span>
              <span className="font-black text-indigo-800 bg-indigo-100 border border-indigo-300 px-2.5 py-0.5 rounded-full font-mono">
                -{stageAcceleration} Days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={stageAcceleration}
              onChange={(e) => setStageAcceleration(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>Standard Timeline</span>
              <span>Fast-track 60 Days</span>
            </div>
          </div>

        </div>

        {/* Right Column: Live Simulation Outcome & Comparison (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Outcome Highlights (3 Key Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric 1: Risk Reduction Delta */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Risk Score Delta</span>
                <TrendingDown className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-emerald-600">
                  -{simResults?.metrics?.riskDelta || 0}%
                </span>
                <span className="text-xs text-slate-500 font-bold">Risk Drop</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {simResults?.original?.riskScore}% <ArrowRight className="w-3 h-3 inline mx-0.5 text-slate-400" /> <strong className="text-emerald-700 font-bold">{simResults?.simulated?.riskScore}%</strong>
              </div>
            </div>

            {/* Metric 2: Projected Days Saved */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Schedule Saved</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-indigo-600">
                  {simResults?.metrics?.projectedDaysSaved || 0}
                </span>
                <span className="text-xs text-slate-500 font-bold">Days</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Fast-tracks project completion date
              </div>
            </div>

            {/* Metric 3: Financial ROI Saved */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Cost Escalation Avoided</span>
                <IndianRupee className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-amber-700 font-mono">
                  ₹{simResults?.metrics?.projectedCostSavedCrore || 0}
                </span>
                <span className="text-xs text-slate-500 font-bold">Cr</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Estimated budget savings
              </div>
            </div>

          </div>

          {/* Visual Risk Gauge Comparison Component */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Before vs After Intervention Comparison</span>
            </h3>

            {/* Gauge 1: Original Risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Current Status (Baseline Risk):</span>
                <span className="text-rose-700 font-black">{simResults?.original?.riskScore || 0}% ({simResults?.original?.riskCategory || 'High'})</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${simResults?.original?.riskScore || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Gauge 2: Simulated Risk */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Simulated Target Status:</span>
                <span className="text-emerald-700 font-black">{simResults?.simulated?.riskScore || 0}% ({simResults?.simulated?.riskCategory || 'Low'})</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${simResults?.simulated?.riskScore || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Simulated Directives Executive Action Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 border border-indigo-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300">
                  Recommended Action Plan
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Ready to Deploy Simulation as Official Directive?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Executing this plan will notify District SLAO officers, schedule compensation camps, and issue expedited Section 19 notification mandates.
                </p>
              </div>
            </div>

            {directiveIssued ? (
              <div className="bg-emerald-500 text-white p-4 rounded-2xl font-bold text-xs flex items-center space-x-2 animate-bounce shadow-md">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Directive successfully generated & broadcasted to District Collectorate SLAO Portal!</span>
              </div>
            ) : (
              <button
                onClick={handleIssueDirective}
                disabled={simulating}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs rounded-2xl transition shadow-md flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Deploy Intervention Mandate to SLAO Field Officers</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
