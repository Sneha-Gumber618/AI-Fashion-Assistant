import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, User, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasDigit: /\d/,
  hasSpecial: /[@$!%*?&#^()_+\-=]/,
  minLength: /.{8,}/,
  maxLength: /^.{0,72}$/,
  name: /^[a-zA-Z\s\-']{2,50}$/,
};

function getPasswordRules(password) {
  return [
    { label: 'At least 8 characters', met: REGEX.minLength.test(password) },
    { label: 'No more than 72 characters', met: REGEX.maxLength.test(password) },
    { label: 'One uppercase letter (A–Z)', met: REGEX.hasUppercase.test(password) },
    { label: 'One lowercase letter (a–z)', met: REGEX.hasLowercase.test(password) },
    { label: 'One number (0–9)', met: REGEX.hasDigit.test(password) },
    { label: 'One special character (@$!%*?&#)', met: REGEX.hasSpecial.test(password) },
  ];
}

function getStrengthLevel(rules) {
  const metCount = rules.filter((r) => r.met).length;
  if (metCount <= 1) return { level: 0, label: 'Very Weak', color: '#ef4444' };
  if (metCount === 2) return { level: 1, label: 'Weak', color: '#f97316' };
  if (metCount === 3) return { level: 2, label: 'Fair', color: '#eab308' };
  if (metCount === 4) return { level: 3, label: 'Strong', color: '#22c55e' };
  return { level: 4, label: 'Very Strong', color: '#10b981' };
}

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const passwordRules = useMemo(() => getPasswordRules(password), [password]);
  const strength = useMemo(() => getStrengthLevel(passwordRules), [passwordRules]);
  const isPasswordValid = passwordRules.every((rule) => rule.met);

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required.';
        if (!REGEX.name.test(value.trim())) return 'Name must be 2–50 letters, spaces, or hyphens only.';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required.';
        if (!REGEX.email.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      case 'password':
        if (!value) return 'Password is required.';
        if (!isPasswordValid) return 'Password does not meet all requirements.';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password.';
        if (value !== password) return 'Passwords do not match.';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    setErrors(nextErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.values(nextErrors).some(Boolean)) {
      showToast('Please fix the errors before submitting.', 'warning');
      return;
    }

    setLoading(true);
    const ok = await register(name.trim(), email.trim(), password);
    setLoading(false);

    if (ok) navigate('/');
  };

  const inputClass = (field) =>
    `w-full text-xs pl-10 pr-10 py-3 rounded-full border font-sans bg-[#FAF7F2] focus:outline-none transition-colors ${
      touched[field] && errors[field]
        ? 'border-red-400 focus:border-red-500'
        : touched[field] && !errors[field]
          ? 'border-green-400 focus:border-green-500'
          : 'border-mocha-200 focus:border-blush-500'
    }`;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-white rounded-3xl border border-mocha-200 p-8 shadow-xs">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-mocha-900 text-blush-200 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block">
            Create Account
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
            Join the Atelier
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name', name)}
                className={inputClass('name')}
                placeholder="Jane Walker"
              />
            </div>
            {touched.name && errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email', email)}
                className={inputClass('email')}
                placeholder="name@example.com"
              />
            </div>
            {touched.email && errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password', password)}
                className={`${inputClass('password')} pr-10`}
                placeholder="Create a secure password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.password && errors.password && <p className="mt-1 text-[10px] text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                className={`${inputClass('confirmPassword')} pr-10`}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600"
                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="mt-1 text-[10px] text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="rounded-2xl border border-mocha-200 bg-[#FAF7F2] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wide text-mocha-600">Password strength</span>
              <span className="text-[10px] font-semibold" style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-mocha-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(strength.level + 1) * 20}%`, backgroundColor: strength.color }}
              />
            </div>
            <div className="mt-3 space-y-1">
              {passwordRules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-2 text-[10px] text-mocha-600">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${rule.met ? 'text-green-500' : 'text-mocha-300'}`} />
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-mocha-500 font-sans mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blush-700 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
