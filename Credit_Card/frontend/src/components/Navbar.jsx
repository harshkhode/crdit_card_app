import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCompareStore from '../store/compareStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selectedCards } = useCompareStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(3,3,8,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Gold accent bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,64,0.4) 30%, rgba(240,200,96,0.65) 50%, rgba(201,168,64,0.4) 70%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #b8860b, #daa520, #f0c060)', boxShadow: '0 4px 16px rgba(201,168,64,0.3)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#0a0800" />
              </svg>
            </div>
            <span className="hidden sm:block text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span style={{ background: 'linear-gradient(135deg, #c9a840, #f0c860)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Elite
              </span>
              <span style={{ color: 'rgba(240,239,232,0.85)' }}>Cards</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-0.5">
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/favorites" active={isActive('/favorites')}>Collection</NavLink>
              <NavLink to="/compare" active={isActive('/compare')}>
                Compare
                {selectedCards.length > 0 && (
                  <span
                    className="ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, #c9a840, #f0c060)', fontSize: '0.6rem' }}
                  >
                    {selectedCards.length}
                  </span>
                )}
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin" active={location.pathname.startsWith('/admin')}>Admin</NavLink>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-black shrink-0"
                    style={{ background: 'linear-gradient(135deg, #b8860b, #f0c060)' }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-xs font-medium" style={{ color: 'rgba(240,239,232,0.5)' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="hidden md:block btn-ghost text-xs py-1.5 px-3">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-xs py-1.5 px-4">Sign In</Link>
                <Link to="/signup" className="btn-gold text-xs py-1.5 px-4">Join Elite</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            {isAuthenticated && (
              <button
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(240,239,232,0.55)' }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && isAuthenticated && (
          <div className="md:hidden pb-4 pt-2 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
            <MobileLink to="/favorites" onClick={() => setMenuOpen(false)}>Collection</MobileLink>
            <MobileLink to="/compare" onClick={() => setMenuOpen(false)}>
              Compare ({selectedCards.length})
            </MobileLink>
            <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</MobileLink>
            {user?.role === 'admin' && (
              <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-sm rounded-xl transition-colors mt-1"
              style={{ color: 'rgba(239,68,68,0.75)' }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className="relative px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
      style={{
        color: active ? '#c9a840' : 'rgba(240,239,232,0.38)',
        background: active ? 'rgba(201,168,64,0.07)' : 'transparent',
        letterSpacing: '0.08em',
      }}
    >
      {children}
      {active && (
        <span
          className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #c9a840, #f0c860)' }}
        />
      )}
    </Link>
  );
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2.5 text-sm rounded-xl transition-colors"
      style={{ color: 'rgba(240,239,232,0.45)' }}
    >
      {children}
    </Link>
  );
}
