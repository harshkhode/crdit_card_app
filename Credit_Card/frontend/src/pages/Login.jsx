import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const BANKS = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'HSBC Bank', 'SBI Card', 'American Express'];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#030308' }}>

      {/* ── Left panel (desktop) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #030308 0%, #06061a 40%, #080814 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Ambient orbs */}
        <div
          className="absolute top-20 right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,64,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-10 left-10 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,168,64,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,64,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Logo mark */}
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-glow"
            style={{ background: 'linear-gradient(135deg, #b8860b, #daa520, #f0c060)', boxShadow: '0 8px 32px rgba(201,168,64,0.35)' }}
          >
            <svg className="w-8 h-8" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#0a0800" />
            </svg>
          </div>

          <h1
            className="font-bold mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.2rem', color: '#f0efe8' }}
          >
            <span className="text-gradient-gold">Elite</span>Cards
          </h1>
          <p className="text-sm mb-2" style={{ color: 'rgba(240,239,232,0.4)' }}>
            India's Premier Credit Card Platform
          </p>

          <div className="luxury-divider w-32 mx-auto my-8" />

          <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(240,239,232,0.35)' }}>
            Compare premium cards, track exclusive rewards, and manage your elite collection.
          </p>

          {/* Bank chips */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {BANKS.map((b) => (
              <div
                key={b}
                className="rounded-xl p-2 text-center text-xs font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(240,239,232,0.35)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.03em',
                }}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #b8860b, #f0c060)', boxShadow: '0 4px 16px rgba(201,168,64,0.3)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#0a0800" />
              </svg>
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f0efe8' }}>
              <span className="text-gradient-gold">Elite</span>Cards
            </span>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
            }}
          >
            <div className="mb-7">
              <h2
                className="font-bold text-2xl mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f0efe8' }}
              >
                Welcome back
              </h2>
              <p className="text-sm" style={{ color: 'rgba(240,239,232,0.35)' }}>
                Sign in to your elite account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(240,239,232,0.35)', letterSpacing: '0.1em' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={errors.email ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
                />
                {errors.email && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.email}</p>}
              </div>

              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(240,239,232,0.35)', letterSpacing: '0.1em' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={errors.password ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
                />
                {errors.password && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3.5 text-sm"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials */}
            <div
              className="mt-5 p-4 rounded-xl"
              style={{ background: 'rgba(201,168,64,0.06)', border: '1px solid rgba(201,168,64,0.18)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(201,168,64,0.7)', letterSpacing: '0.1em' }}>
                Demo Credentials
              </p>
              <p className="text-xs" style={{ color: 'rgba(240,239,232,0.45)' }}>
                Admin: admin@cardcompare.com / Admin@123
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(240,239,232,0.45)' }}>
                User: john@example.com / User@123
              </p>
            </div>

            <p className="text-center text-sm mt-6" style={{ color: 'rgba(240,239,232,0.3)' }}>
              New to EliteCards?{' '}
              <Link to="/signup" className="font-semibold transition-colors" style={{ color: '#c9a840' }}>
                Join now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
