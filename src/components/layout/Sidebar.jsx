import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  BrainCircuit, 
  Map, 
  Lightbulb, 
  Bell, 
  Users, 
  ShieldCheck,
  FileSpreadsheet,
  Sliders
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Executive Overview', icon: LayoutDashboard },
  { path: '/national-risk-dashboard', label: 'National Risk Portal', icon: ShieldCheck },
  { path: '/projects', label: 'Projects Directory', icon: FolderKanban },
  { path: '/analytics', label: 'Predictive AI (XAI)', icon: BrainCircuit },
  { path: '/simulator', label: 'What-If Simulator', icon: Sliders },
  { path: '/gis-map', label: 'GIS Digital Map', icon: Map },
  { path: '/interventions', label: 'Action Directives', icon: Lightbulb },
  { path: '/alerts', label: 'Alert Center', icon: Bell },
  { path: '/officers', label: 'Officer Efficiency', icon: Users },
  { path: '/audit-logs', label: 'Audit Trail & Exports', icon: ShieldCheck },
];


export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-700 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3 shadow-xs no-print">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Officer Portal Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-amber-100/80 text-amber-900 border border-amber-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Badge */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
        <div className="flex items-center space-x-1 text-amber-800 font-bold">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>RFCTLARR Act 2013</span>
        </div>
        <p className="text-slate-500 text-[10px]">
          Compliant with RFCTLARR Act 2013 & MoRD Digital Portal Directives.
        </p>
      </div>
    </aside>
  );
};
