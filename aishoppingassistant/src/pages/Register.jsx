import React, { useState, useMemo } from 'react';
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, User, Mail, Lock, ArrowRight, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

// ─── Regex Patterns (mirrored from server/middleware/validate.middleware.js) ───
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

// ─── Password Strength Rules ───────────────────────────────────────────────────
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ─── Live Password Strength Calculation ─────────────────────────────────────
  const passwordRules = useMemo(() => getPasswordRules(password), [password]);
  const strength = useMemo(() => getStrengthLevel(passwordRules), [passwordRules]);
  const isPasswordValid = passwordRules.every((r) => r.met);

  // ─── Field-level validation with Regex ──────────────────────────────────────
  function validateField(field, value) {
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
  }

  function handleBlur(field, value) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }

  // ─── Form Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ─── Live Password Strength Calculation ─────────────────────────────────────
  const passwordRules = useMemo(() => getPasswordRules(password), [password]);
  const strength = useMemo(() => getStrengthLevel(passwordRules), [passwordRules]);
  const isPasswordValid = passwordRules.every((r) => r.met);

  // ─── Field-level validation with Regex ──────────────────────────────────────
  function validateField(field, value) {
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
  }

  function handleBlur(field, value) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }

  // ─── Form Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all validations before submit
    const newErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.values(newErrors).some((e) => e)) {
      showToast('Please fix the errors before submitting.', 'warning');
    // Run all validations before submit
    const newErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.values(newErrors).some((e) => e)) {
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
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 animate-fade-in">
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-mocha-900 text-blush-200 flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block">
          Client Enrollment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
          Create Atelier Profile
        </h1>
        <p className="text-xs text-mocha-600 font-sans">
          Join ShopAI for personalized styling and seasonal launch privileges
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-mocha-200 p-8 shadow-xs space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Name */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-name"
                id="register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => handleBlur('name', e.target.value)}
                onBlur={(e) => handleBlur('name', e.target.value)}
                placeholder="Priya Sharma"
                className={inputClass('name')}
                className={inputClass('name')}
              />
            </div>
            {touched.name && errors.name && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
            {touched.name && errors.name && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          {/* Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-email"
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                placeholder="name@example.com"
                className={inputClass('email')}
                className={inputClass('email')}
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
            {touched.email && errors.email && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          {/* Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Password
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                maxLength={72}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                placeholder="••••••••"
                className={inputClass('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
                className={inputClass('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* ── Password Strength Meter ── */}
            {password.length > 0 && (
              <div className="mt-2 space-y-2">
                {/* Strength bar */}
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i <= strength.level ? strength.color : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-mono" style={{ color: strength.color }}>
                  {strength.label}
                </p>

                {/* Rule checklist */}
                <div className="space-y-1">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      {rule.met ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                      )}
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: rule.met ? '#22c55e' : '#9ca3af' }}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Password Strength Meter ── */}
            {password.length > 0 && (
              <div className="mt-2 space-y-2">
                {/* Strength bar */}
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i <= strength.level ? strength.color : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-mono" style={{ color: strength.color }}>
                  {strength.label}
                </p>

                {/* Rule checklist */}
                <div className="space-y-1">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      {rule.met ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                      )}
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: rule.met ? '#22c55e' : '#9ca3af' }}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mocha-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className={inputClass('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
                className={inputClass('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-mocha-400 hover:text-mocha-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {errors.confirmPassword}
              </p>
            )}
            {touched.confirmPassword && !errors.confirmPassword && confirmPassword && (
              <p className="text-[10px] text-green-500 mt-1 ml-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Passwords match!
              </p>
            )}
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {errors.confirmPassword}
              </p>
            )}
            {touched.confirmPassword && !errors.confirmPassword && confirmPassword && (
              <p className="text-[10px] text-green-500 mt-1 ml-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Passwords match!
              </p>
            )}
          </div>

          <button
            id="register-submit"
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            className="w-full py-4 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                Complete Atelier Registration
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                Complete Atelier Registration
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-mocha-600 pt-2 border-t border-mocha-100 font-sans">
          Already an Atelier Member?{' '}
          <Link to="/login" className="text-blush-700 font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
