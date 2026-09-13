import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast, useToast } from '../components/common/Toast';
import { Mail, Lock, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Signup = () => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, register } = useAuth();
  const { toast, showToast, clearToast } = useToast();

  const [step, setStep] = useState(1); // 1: Email+Pass | 2: OTP Verification
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);

  // ── Step 1: Email & Password -> Send OTP ─────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return showToast('Please enter your email', 'warning');
    if (!password || password.length < 8) {
      return showToast('Password must be at least 8 characters long', 'warning');
    }
    if (!/[A-Z]/.test(password)) {
      return showToast('Password must contain at least one uppercase letter (A-Z)', 'warning');
    }
    if (!/[0-9]/.test(password)) {
      return showToast('Password must contain at least one number (0-9)', 'warning');
    }

    setBusy(true);
    try {
      await sendOTP(email);
      setStep(2);
      showToast(`OTP sent to ${email}. Please check your inbox.`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      showToast(msg, 'error');
    } finally {
      setBusy(false);
    }
  };

  // ── Step 2: Verify OTP & Register ───────────────────────────────────────────
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return showToast('Enter the 6-digit OTP code', 'warning');

    setBusy(true);
    try {
      // 1. Verify OTP to get tempToken
      const res = await verifyOTP(email, otp);
      const tempToken = res.tempToken;

      // 2. Complete registration with backend
      const rawName = email.split('@')[0].replace(/[._]/g, ' ');
      const fullName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      const result = await register({
        tempToken,
        fullName,
        password,
        role: 'district_officer',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        designation: 'Officer',
        phone: '',
      });

      if (result.success) {
        showToast('Registration successful! Redirecting to dashboard…', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showToast(result.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      showToast(msg, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative">
      <Toast {...toast} onClose={clearToast} />
      <div className="goi-tricolor-bar absolute top-0 left-0 right-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2">
        <img src="/emblem.svg" alt="National Emblem" className="mx-auto h-14 w-14" />
        <h1 className="text-xl font-black text-slate-900">अधिकारी पंजीकरण | Officer Registration</h1>
        <p className="text-xs text-amber-800 font-semibold">Department of Land Resources (DoLR) | Government of India</p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition
                ${step >= s ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'}`}
              >
                {s}
              </div>
              {s < 2 && <div className={`w-8 h-0.5 ${step > s ? 'bg-amber-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">
          {step === 1 && 'Step 1: Enter email & create password'}
          {step === 2 && 'Step 2: Enter OTP sent to your email to complete registration'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-4 text-xs" onSubmit={step === 1 ? handleSendOTP : handleVerifyAndRegister}>
            {/* ── STEP 1: Email & Password ──────────────────────── */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Govt Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@gov.in"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. Secret123"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Min 8 characters, at least 1 uppercase letter (A-Z) & 1 number (0-9)</p>
                </div>
              </>
            )}

            {/* ── STEP 2: Enter OTP ────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 flex items-start space-x-2">
                  <KeyRound className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Check your email</p>
                    <p>An OTP code was sent to <strong>{email}</strong>.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-center">Enter 6-Digit OTP Code</label>
                  <input
                    id="signup-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="1 2 3 4 5 6"
                    className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-slate-50 border-2 border-amber-400 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                    }}
                    className="hover:text-slate-800 underline"
                  >
                    ← Change Email / Password
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition disabled:opacity-60"
            >
              {busy ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing…
                </span>
              ) : (
                <>
                  <span>{step === 1 ? 'Send OTP' : 'Verify OTP & Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-amber-700 hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

