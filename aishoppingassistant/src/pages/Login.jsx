import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Shield, Compass } from 'lucide-react';

export default function Login() {
  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Destination if redirected here
  const destination = location.state?.from || '/';

  const handleSubmit = async (e) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiError('');
    setLoading(true);

    const ok = await login(email, password);
    setLoading(false);

    if (ok) {
      navigate(destination);
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate('/products');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-mocha-900 text-blush-200 flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block">
          Atelier Member Access
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
          Welcome to ShopAI
        </h1>
        <p className="text-xs text-mocha-600 font-sans">
          Sign in to access complete piece specifications, shopping bag, wishlist, and past orders.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-mocha-200 p-8 shadow-xs space-y-5">
        {/* Security Info Banner */}
        <div className="flex items-start gap-2.5 bg-blush-50 border border-blush-200 rounded-2xl p-3">
          <ShieldCheck className="w-4 h-4 text-blush-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-mocha-600 font-sans leading-relaxed">
            <span className="font-bold text-mocha-800">Secure Member Access.</span>{' '}
            Your personal credentials and shopping session are safely encrypted and protected.
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
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-full border border-mocha-200 focus:outline-none focus:border-blush-500 font-sans bg-[#FAF7F2] transition-colors"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-full border border-mocha-200 focus:outline-none focus:border-blush-500 font-sans bg-[#FAF7F2] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
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
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-10 py-3 rounded-full border border-mocha-200 focus:outline-none focus:border-blush-500 font-sans bg-[#FAF7F2] transition-colors"
                className="w-full text-xs pl-10 pr-10 py-3 rounded-full border border-mocha-200 focus:outline-none focus:border-blush-500 font-sans bg-[#FAF7F2] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-mocha-200"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-mocha-400">or explore</span>
          <div className="flex-grow border-t border-mocha-200"></div>
        </div>

        {/* Guest Browsing Option */}
        <div className="text-center space-y-2">
          <button
            id="login-guest-btn"
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full py-3.5 rounded-full bg-[#FAF7F2] hover:bg-[#F4ECE1] border-2 border-dashed border-mocha-300 hover:border-mocha-500 text-mocha-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all group"
          >
            <Compass className="w-4 h-4 text-blush-700 group-hover:rotate-45 transition-transform" />
            <span>Continue as Guest</span>
          </button>
          <p className="text-[10px] text-mocha-500 font-sans leading-relaxed">
            Browse our entire collection and live lookbook as a guest. Member sign in is required to view deep specifications, save to bag, or complete checkout.
          </p>
        </div>

        <p className="text-center text-xs text-mocha-600 pt-3 border-t border-mocha-100 font-sans">
          Not yet registered?{' '}
          <Link to="/register" className="text-blush-700 font-bold hover:underline">
            Create an Account
          </Link>
        </p>

        {/* Admin Portal Gateway Link */}
        <div className="pt-2 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-mocha-400 hover:text-mocha-900 transition-colors"
          >
            <Shield className="w-3 h-3 text-mocha-500" />
            <span>Merchant / Admin Clearance Portal →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
