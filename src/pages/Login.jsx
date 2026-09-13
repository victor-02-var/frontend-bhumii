import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, DEMO_ROLES } from '../context/AuthContext';
import { Toast, useToast } from '../components/common/Toast';
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, switchDemoRole, loading } = useAuth();
  const { toast, showToast, clearToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  // ── Direct Login with Email + Password ──────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return showToast('Please enter your email address', 'warning');
    if (!password) return showToast('Please enter your password', 'warning');

    setBusy(true);
    const result = await login(email, password);
    setBusy(false);

    if (result.success) {
      if (result.demo) showToast('Backend offline — signed in with demo account', 'warning');
      navigate('/dashboard');
    } else {
      showToast(result.message || 'Authentication failed. Check your credentials.', 'error');
    }
  };

  // ── Quick demo role login (SIH evaluation) ────────────────────────────────
  const handleQuickLogin = async (r) => {
    switchDemoRole(r);
    const result = await login(`${r.role}@landguard.gov.in`, 'password123');
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative">
      <Toast {...toast} onClose={clearToast} />
      <div className="goi-tricolor-bar absolute top-0 left-0 right-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Portal</span>
        </Link>
        <img src="/emblem.svg" alt="National Emblem" className="mx-auto h-14 w-14" />
        <h1 className="text-xl font-black text-slate-900">अधिकारी लॉगिन | Officer Login</h1>
        <p className="text-xs text-amber-800 font-semibold">
          Department of Land Resources (DoLR) | Government of India
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-4 text-xs" onSubmit={handleLogin}>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Govt Email ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@gov.in"
                  className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy || loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition disabled:opacity-60"
            >
              {busy || loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating…
                </span>
              ) : (
                <>
                  <span>Sign In &amp; Access Portal</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* ── Quick Demo Role Switcher (SIH) ──────────────────────────── */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 mb-3 flex items-center justify-between">
              <span>SIH Hackathon Quick-Role Login:</span>
              <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">Evaluation Ready</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ROLES.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleQuickLogin(r)}
                  className="p-2 text-left bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-lg text-[11px] text-slate-800 transition"
                >
                  <p className="font-bold text-amber-800 capitalize">{r.role.replace('_', ' ')}</p>
                  <p className="text-[9px] text-slate-500 truncate">{r.state || 'National'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              New officer?{' '}
              <Link to="/signup" className="font-bold text-amber-700 hover:underline">
                Register officer account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
