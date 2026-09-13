import React, { useState } from 'react';
import api from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Analytics = () => {
  const [selectedProject, setSelectedProject] = useState('NH-58-UP-2024');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState({
    risk_score: 84,
    delay_probability: 0.84,
    risk_category: 'High',
    predicted_by: 'rule_engine',
    model_version: 'v1.0.0-rule-engine',
    top_delay_factors: [
      { factor: 'Legal Disputes Pending', contribution: 28, category: 'legal', description: '4 court stay orders filed by land owners' },
      { factor: 'Compensation Disbursement Stall', contribution: 24, category: 'compensation', description: 'Disbursement < 35% after 180 days of award' },
      { factor: 'Section 11 Lapse Proximity', contribution: 18, category: 'admin', description: '12 days remaining until statutory lapse' },
      { factor: 'Incomplete Survey Documentation', contribution: 14, category: 'documentation', description: '8 pending land title deeds' },
      { factor: 'R&R Resettlement Lag', contribution: 10, category: 'rr', description: 'Rehabilitation progress lags behind possession' }
    ]
  });

  const handleRunPrediction = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/predictions/run/demo-project-id`).catch(() => null);
      if (res?.data?.prediction) {
        setPrediction(res.data.prediction);
      }
    } catch (err) {
      console.error('Prediction trigger error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-amber-600" />
            <span>एआई पूर्वानुमान एवं व्याख्यात्मक विश्लेषण (XAI)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Explainable AI (SHAP-based) Factor Contribution Breakdown & Risk Scoring Engine
          </p>
        </div>

        <button
          onClick={handleRunPrediction}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loading ? 'Executing AI Engine...' : 'Run Live Prediction Engine'}</span>
        </button>
      </div>

      {/* Top Score Summary Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-xs">
        
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Selected Project</p>
          <p className="text-sm font-bold text-slate-900">{selectedProject}</p>
          <p className="text-[10px] text-slate-500">Highway Expansion Project</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Delay Probability</p>
          <p className="text-2xl font-mono font-black text-amber-800">
            {(prediction.delay_probability * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-slate-500 font-medium">Likelihood of Project Delay</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Risk Scorecard</p>
          <div className="mt-1">
            <RiskBadge category={prediction.risk_category} score={prediction.risk_score} />
          </div>
          <p className="text-[10px] text-slate-500">Score 0 (Low) to 100 (Critical)</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Prediction Source</p>
          <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
            {prediction.predicted_by === 'ml_model' ? 'Python ML Model (FastAPI Webhook)' : 'Node.js Rule Engine'}
          </p>
          <p className="text-[10px] text-slate-500">Model Version: {prediction.model_version}</p>
        </div>

      </div>

      {/* Explainable AI (SHAP) Factor Breakdown Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              SHAP Factor Contribution Breakdown (%)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Quantifying how individual administrative, legal, and financial parameters push up delay risk
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-slate-300 font-mono">
            Explainable AI (XAI)
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={prediction.top_delay_factors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
              <YAxis dataKey="factor" type="category" stroke="#64748b" fontSize={11} width={190} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', fontSize: '12px' }} />
              <Bar dataKey="contribution" fill="#d97706" radius={[0, 4, 4, 0]} name="Risk Contribution %">
                {prediction.top_delay_factors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.contribution > 20 ? '#dc2626' : entry.contribution > 15 ? '#ea580c' : '#d97706'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Factor Detail List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Detailed Factor Analysis & Descriptions
        </h3>

        <div className="space-y-2">
          {prediction.top_delay_factors.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px]">
                  #{idx + 1}
                </span>
                <div>
                  <p className="font-bold text-slate-900">{item.factor}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{item.description}</p>
                </div>
              </div>

              <span className="font-mono font-bold text-amber-800 text-xs">
                +{item.contribution}% Contribution
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
