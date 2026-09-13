import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'amber' }) => {
  const colorClasses = {
    amber: 'border-l-4 border-l-amber-600 bg-white shadow-xs',
    emerald: 'border-l-4 border-l-emerald-600 bg-white shadow-xs',
    rose: 'border-l-4 border-l-rose-600 bg-white shadow-xs',
    blue: 'border-l-4 border-l-blue-600 bg-white shadow-xs'
  };

  return (
    <div className={`p-5 rounded-2xl border border-slate-200 ${colorClasses[color] || colorClasses.amber}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-100 text-amber-700">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
