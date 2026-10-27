import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, UserCheck, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setLoading(true);

    const ok = await login(email, password);
    setLoading(false);

    if (ok) {
      navigate('/');
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@shopai.com');
    setPassword('Demo@1234');
    setApiError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-mocha-900 text-blush-200 flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block">
          Atelier Access
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
          Welcome to ShopAI
        </h1>
        <p className="text-xs text-mocha-600 font-sans">
          Sign in to access your curated wishlist, past orders, and AI styling history
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-mocha-200 p-8 shadow-xs space-y-5">

        {/* JWT Auth Info Banner */}
        <div className="flex items-start gap-2.5 bg-blush-50 border border-blush-200 rounded-2xl p-3">
          <ShieldCheck className="w-4 h-4 text-blush-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-mocha-600 font-sans leading-relaxed">
            <span className="font-bold text-mocha-800">Secured with JWT & Bcrypt.</span>{' '}
            Your password is hashed server-side and a signed token is issued for session management.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* API Error Message */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-xs text-red-700 font-sans">
              {apiError}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-full border border-mocha-200 focus:outline-none focus:border-blush-500 font-sans bg-[#FAF7F2] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600">
                Password
              </label>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blush-700 cursor-pointer hover:underline">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="login-password"
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
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In to Atelier
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-mocha-100 text-center">
          <button
            id="login-demo-fill"
            type="button"
            onClick={handleFillDemo}
            className="w-full py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F4ECE1] border border-mocha-200 text-mocha-800 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-mocha-600" />
            Quick Auto-Fill Demo Credentials
          </button>
          <p className="text-[9px] text-mocha-400 font-mono mt-1">
            (First register the demo account, then log in)
          </p>
        </div>

        <p className="text-center text-xs text-mocha-600 pt-2 font-sans">
          Not yet registered?{' '}
          <Link to="/register" className="text-blush-700 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
