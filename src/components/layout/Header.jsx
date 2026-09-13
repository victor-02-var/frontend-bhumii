import React, { useState } from 'react';
import { useAuth, DEMO_ROLES } from '../../context/AuthContext';
import { ShieldAlert, User, LogOut, ChevronDown, Flag, Building2 } from 'lucide-react';

export const Header = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
      {/* Top Govt Tricolor Accent Bar */}
      <div className="goi-tricolor-bar"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: National Emblem & Title */}
          <div className="flex items-center space-x-3">
            <img src="/emblem.svg" alt="National Emblem of India" className="h-10 w-10 object-contain" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-wider text-amber-800 uppercase">भारत सरकार | Govt of India</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 font-mono font-bold">SIH PS-25017</span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                भूमि अधिग्रहण अनुश्रवण एवं पूर्वानुमान प्रणाली
              </h1>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Land Guard AI — Predictive Analytics System for Early Detection of Delays
              </p>
            </div>
          </div>

          {/* Right: Role Selector & User Badge */}
          <div className="flex items-center space-x-4">
            
            {/* Quick Role Switcher for Hackathon Demonstrations */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span className="font-semibold text-slate-800">Role: <strong className="text-amber-800 capitalize">{user?.role?.replace('_', ' ')}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Switch Role Context</div>
                  {DEMO_ROLES.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchDemoRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center space-x-2 transition ${
                        user?.role === r.role ? 'bg-amber-100/60 text-amber-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <Flag className="w-3 h-3 text-slate-400" />
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-800">{user.full_name}</p>
                  <p className="text-[10px] text-slate-500">{user.state || 'National Portal'}</p>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
