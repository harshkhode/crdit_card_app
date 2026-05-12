import { useState, useEffect, useCallback } from 'react';
import CardItem from '../components/CardItem';
import FilterPanel from '../components/FilterPanel';
import CompareBar from '../components/CompareBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCards } from '../services/cardService';
import { getFavorites } from '../services/userService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const BANKS = [
  'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'IDFC First Bank',
  'HSBC Bank', 'SBI Card', 'American Express', 'Citi Bank',
];

const BANK_SHORT = {
  'HDFC Bank': 'HDFC', 'ICICI Bank': 'ICICI', 'Axis Bank': 'Axis',
  'IDFC First Bank': 'IDFC', 'HSBC Bank': 'HSBC', 'SBI Card': 'SBI',
  'American Express': 'Amex', 'Citi Bank': 'Citi',
};

const DEFAULT_FILTERS = {
  sortBy: 'popularity', bank: '', cardType: '', minFee: '', maxFee: '', maxIncome: '',
};

const STATS = [
  { value: '12+',  label: 'Elite Cards',     icon: '◆' },
  { value: '8',    label: 'Premium Banks',   icon: '◈' },
  { value: '∞',    label: 'Lounge Access',   icon: '✈' },
  { value: '24/7', label: 'Concierge',       icon: '◉' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({});
  const [activeBank, setActiveBank] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data.data.map((c) => c._id));
    } catch {}
  }, []);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        cardType: 'premium',
        ...(search && { search }),
        ...(filters.bank && { bank: filters.bank }),
        ...(activeBank && { bank: activeBank }),
        ...(filters.minFee && { minFee: filters.minFee }),
        ...(filters.maxFee && { maxFee: filters.maxFee }),
        ...(filters.maxIncome && { maxIncome: filters.maxIncome }),
        sortBy: filters.sortBy,
        limit: 24,
      };
      const res = await getCards(params);
      setCards(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [search, filters, activeBank]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);
  useEffect(() => { fetchCards(); }, [fetchCards]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setActiveBank('');
  };

  const cardsByBank = BANKS.reduce((acc, bank) => {
    acc[bank] = cards.filter((c) => c.bank === bank);
    return acc;
  }, {});

  const totalCount = pagination.total || cards.length;

  return (
    <div className="min-h-screen" style={{ background: '#030308' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <div className="hero-bg hero-grid relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-10 right-[8%] w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(201,168,64,0.12) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 left-[4%] w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)' }}
          />
          {/* Particle dots */}
          <div className="particle" style={{ top: '20%', right: '25%' }} />
          <div className="particle" style={{ top: '60%', right: '18%', animationDelay: '-3s' }} />
          <div className="particle" style={{ top: '40%', right: '35%', animationDelay: '-1.5s' }} />
        </div>

        {/* Floating card decorations (desktop only) */}
        <div
          className="hidden lg:block absolute animate-float"
          style={{ right: '4rem', top: '50%', transform: 'translateY(-50%)' }}
        >
          <div
            className="relative w-56 h-36 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #020b24 0%, #071a52 35%, #0c2880 65%, #071a52 100%)',
              border: '1px solid rgba(201,168,64,0.3)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.8), 0 0 20px rgba(7,26,82,0.5)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(201,168,64,0.08) 60%, transparent 90%)' }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4 select-none">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>HDFC BANK</p>
                <span className="badge-premium">Ultra Premium</span>
              </div>
              <p className="font-bold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Infinia Metal</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 rounded" style={{ background: 'linear-gradient(135deg, #a87820, #e8c96e)' }} />
                <span className="ml-auto font-mono text-xs" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>•••• ••••</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hidden lg:block absolute animate-float"
          style={{ right: '9rem', top: '28%', animationDelay: '1.8s' }}
        >
          <div
            className="w-44 h-28 rounded-xl overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(145deg, #0d0520, #22094a, #360e72)',
              border: '1px solid rgba(139,92,246,0.25)',
              transform: 'rotate(-9deg)',
              opacity: 0.75,
            }}
          >
            <div className="p-3">
              <p className="text-xs font-bold tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>AXIS BANK</p>
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-xl">
            {/* Sub-label */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #c9a840)' }} />
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: '#c9a840', letterSpacing: '0.22em' }}
              >
                Elite Collection · 2026
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-bold leading-none mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}
            >
              <span className="text-gradient-white block mb-1">India's Finest</span>
              <span className="text-gradient-gold block">Premium Cards</span>
            </h1>

            <p className="text-base mb-8" style={{ color: 'rgba(240,239,232,0.4)', lineHeight: 1.7 }}>
              Curated exclusively for those who demand the best — unlimited lounge access, elite rewards, and world-class concierge.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                style={{ color: 'rgba(201,168,64,0.55)', width: '1.1rem', height: '1.1rem' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search premium cards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,168,64,0.22)',
                  color: '#f0efe8',
                  backdropFilter: 'blur(20px)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,64,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,64,0.22)')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <div style={{ background: 'rgba(255,255,255,0.018)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {STATS.map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-3 shrink-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(201,168,64,0.08)', border: '1px solid rgba(201,168,64,0.18)' }}
                >
                  <span style={{ color: '#c9a840', fontSize: '0.82rem' }}>{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold leading-none" style={{ color: '#f0efe8' }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(240,239,232,0.3)' }}>{s.label}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px h-7 ml-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Bank filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <BankPill label="All Banks" active={!activeBank} onClick={() => setActiveBank('')} />
          {BANKS.map((b) => (
            <BankPill
              key={b}
              label={BANK_SHORT[b] || b}
              active={activeBank === b}
              onClick={() => setActiveBank(activeBank === b ? '' : b)}
            />
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-58 shrink-0" style={{ width: '14.5rem' }}>
            <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} />
          </div>

          {/* Cards grid */}
          <div className="flex-1 min-w-0">
            {/* Top row meta */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-5" style={{ background: 'linear-gradient(90deg, #c9a840, transparent)' }} />
                <p className="text-xs font-medium" style={{ color: 'rgba(240,239,232,0.3)', letterSpacing: '0.04em' }}>
                  {loading ? 'Loading collection…' : `${totalCount} Premium Cards`}
                </p>
              </div>
              <button
                className="lg:hidden btn-ghost text-xs py-1.5 px-3"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Filters ›'}
              </button>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} />
              </div>
            )}

            {loading ? (
              <LoadingSpinner text="Curating elite collection…" />
            ) : cards.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : activeBank ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                  <div key={card._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 65}ms` }}>
                    <CardItem card={card} isFavorited={favorites.includes(card._id)} onFavoriteChange={() => fetchFavorites()} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-14">
                {BANKS.map((bank) => {
                  const bankCards = cardsByBank[bank];
                  if (!bankCards?.length) return null;
                  return (
                    <section key={bank}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.04)' }} />
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: 'rgba(240,239,232,0.3)', letterSpacing: '0.14em' }}
                          >
                            {bank}
                          </span>
                          <span className="badge-gold">{bankCards.length}</span>
                        </div>
                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.04)' }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {bankCards.map((card, i) => (
                          <div key={card._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 65}ms` }}>
                            <CardItem card={card} isFavorited={favorites.includes(card._id)} onFavoriteChange={() => fetchFavorites()} />
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <CompareBar />
    </div>
  );
}

function BankPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200"
      style={
        active
          ? {
              background: 'linear-gradient(135deg, #b8860b, #daa520, #f0c060)',
              color: '#0a0800',
              boxShadow: '0 4px 16px rgba(201,168,64,0.35)',
              letterSpacing: '0.1em',
            }
          : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(240,239,232,0.38)',
              letterSpacing: '0.1em',
            }
      }
    >
      {label}
    </button>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="text-center py-24">
      <div
        className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
        style={{ background: 'rgba(201,168,64,0.08)', border: '1px solid rgba(201,168,64,0.2)' }}
      >
        <span style={{ color: '#c9a840', fontSize: '1.5rem' }}>◆</span>
      </div>
      <p className="font-semibold mb-1.5" style={{ color: 'rgba(240,239,232,0.5)' }}>No premium cards matched</p>
      <p className="text-sm mb-5" style={{ color: 'rgba(240,239,232,0.25)' }}>Try adjusting your filters</p>
      <button onClick={onReset} className="btn-gold text-xs">Reset Filters</button>
    </div>
  );
}
