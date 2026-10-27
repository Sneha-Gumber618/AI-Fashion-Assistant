import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated as admin, allow immediate entrance
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await adminLogin(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setErrorMsg(result.message || 'Invalid administrator credentials. Access restricted.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 animate-fade-in">
      {/* Return to store link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-mocha-600 hover:text-mocha-950 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Client Storefront
      </Link>

      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#1C120B] text-blush-300 flex items-center justify-center mx-auto shadow-xl border border-mocha-800">
          <Shield className="w-7 h-7 text-blush-400" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block">
          Restricted Atelier System
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
          Administrator Portal
        </h1>
        <p className="text-xs text-mocha-600 font-sans max-w-sm mx-auto">
          Authorized personnel only. Administrator credentials required to manage products, catalog inventory, and orders.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-mocha-300/80 p-8 shadow-lg space-y-5">
        {/* Security Warning Notice */}
        <div className="flex items-start gap-2.5 bg-[#FAF7F2] border border-mocha-300 rounded-2xl p-3.5">
          <ShieldAlert className="w-4 h-4 text-mocha-800 shrink-0 mt-0.5" />
          <p className="text-[11px] text-mocha-700 font-sans leading-relaxed">
            <span className="font-bold text-mocha-950">Restricted Access:</span> Standard customer accounts cannot access this portal. Verified administrator credentials are required.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-sans leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shopai.com"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-full border border-mocha-200 focus:outline-none focus:border-blush-500 font-sans bg-[#FAF7F2] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Admin Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-10 py-3 rounded-full border border-mocha-200 focus:outline-none focus:border-blush-500 font-sans bg-[#FAF7F2] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#1C120B] hover:bg-blush-800 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying Clearance...
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-blush-300" />
                Enter Administrator Portal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
