import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, getBankGradient, getBankAccent } from '../utils/helpers';
import useCompareStore from '../store/compareStore';
import useAuthStore from '../store/authStore';
import { toggleFavorite } from '../services/userService';
import toast from 'react-hot-toast';

export default function CardItem({ card, isFavorited = false, onFavoriteChange }) {
  const { isAuthenticated } = useAuthStore();
  const { addCard, removeCard, isSelected } = useCompareStore();
  const [favorited, setFavorited] = useState(isFavorited);
  const [favLoading, setFavLoading] = useState(false);

  const selected = isSelected(card._id);
  const gradient = getBankGradient(card.bank);
  const accent = getBankAccent(card.bank);
  const isUltra = (card.fees?.annualFee >= 10000);

  const handleCompare = (e) => {
    e.preventDefault();
    if (selected) {
      removeCard(card._id);
      toast('Removed from comparison', { icon: '−' });
    } else {
      const result = addCard(card);
      if (result === 'max') toast.error('Max 4 cards in comparison');
      else toast.success('Added to comparison');
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Sign in to save cards'); return; }
    setFavLoading(true);
    try {
      await toggleFavorite(card._id);
      setFavorited(!favorited);
      onFavoriteChange?.(!favorited, card._id);
      toast.success(favorited ? 'Removed from collection' : 'Saved to collection');
    } catch {
      toast.error('Failed to update');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="premium-card-wrap group">
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden card-shadow transition-all duration-400"
        style={{
          background: '#0d0d1c',
          border: selected ? `1px solid rgba(201,168,64,0.55)` : '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* ═══════════════════════════════════
            CREDIT CARD VISUAL
        ═══════════════════════════════════ */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: '86/54', background: gradient }}
        >
          {/* Holographic rainbow overlay */}
          <div className="holographic absolute inset-0 z-10 pointer-events-none" />

          {/* Subtle radial highlights */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 55% 45% at 20% 40%, rgba(255,255,255,0.08) 0%, transparent 55%),' +
                'radial-gradient(ellipse 35% 30% at 80% 75%, rgba(255,255,255,0.05) 0%, transparent 55%)',
            }}
          />

          {/* Gold diagonal shimmer on hover */}
          <div
            className="shimmer-gold absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.16) 50%, transparent 75%)',
              transform: 'translateX(-200%) skewX(-20deg)',
            }}
          />

          {/* Bank accent glow top-right */}
          <div
            className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, opacity: 0.7 }}
          />

          {/* Card content */}
          <div className="relative z-30 h-full flex flex-col justify-between p-5 select-none">
            {/* Top row: bank + ultra badge */}
            <div className="flex items-start justify-between">
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em' }}
              >
                {card.bank}
              </p>
              {isUltra && (
                <span className="badge-premium">Ultra Premium</span>
              )}
            </div>

            {/* Card name */}
            <p
              className="font-bold text-white leading-tight line-clamp-2"
              style={{ fontSize: '1.05rem', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
            >
              {card.name}
            </p>

            {/* EMV Chip + NFC + number */}
            <div className="flex items-center gap-3">
              {/* Gold EMV chip */}
              <div
                className="relative w-10 h-7 rounded flex items-center justify-center shrink-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #a87820 0%, #e8c96e 40%, #c8a04a 70%, #daa030 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <div
                  className="absolute inset-0.5 rounded"
                  style={{ border: '1px solid rgba(168,120,32,0.6)' }}
                />
                <div className="grid grid-cols-2 grid-rows-2 gap-0.5 p-1.5 w-full h-full">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-sm" style={{ background: 'rgba(120,80,10,0.45)' }} />
                  ))}
                </div>
              </div>

              {/* NFC wave */}
              <svg className="w-5 h-6 shrink-0" viewBox="0 0 14 20" fill="none" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <circle cx="2.5" cy="10" r="1.6" fill="currentColor" />
                <path d="M5.5 6.5C7.3 7.8 8.2 8.9 8.2 10C8.2 11.1 7.3 12.2 5.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M8.5 3.5C11 5.2 12.5 7.4 12.5 10C12.5 12.6 11 14.8 8.5 16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>

              <span
                className="ml-auto font-mono text-xs"
                style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.22em' }}
              >
                •••• •••• ••••
              </span>
            </div>

            {/* Bottom row: holder + rating + network */}
            <div className="flex items-end justify-between">
              <div>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Card Member
                </p>
                <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>PREMIUM HOLDER</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Rating pill */}
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(201,168,64,0.18)', border: '1px solid rgba(201,168,64,0.35)' }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="#f0c860">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-bold" style={{ color: '#f0c860', lineHeight: 1 }}>{card.rating}</span>
                </div>

                {/* Mastercard circles */}
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full" style={{ background: 'rgba(220,40,40,0.75)', boxShadow: '0 1px 4px rgba(0,0,0,0.6)' }} />
                  <div className="w-5 h-5 rounded-full -ml-2.5" style={{ background: 'rgba(235,155,40,0.8)', boxShadow: '0 1px 4px rgba(0,0,0,0.6)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════
            DETAIL SECTION
        ═══════════════════════════════════ */}
        <div className="flex-1 flex flex-col p-4">
          {/* Fees row */}
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.055)' }}
            >
              <p style={{ color: 'rgba(240,239,232,0.28)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                Joining Fee
              </p>
              <p className="font-bold text-sm" style={{ color: '#f0efe8' }}>{formatCurrency(card.fees?.joiningFee)}</p>
            </div>
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.055)' }}
            >
              <p style={{ color: 'rgba(240,239,232,0.28)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                Annual Fee
              </p>
              <p className="font-bold text-sm" style={{ color: '#f0efe8' }}>{formatCurrency(card.fees?.annualFee)}</p>
            </div>
          </div>

          {/* Key benefits */}
          <div className="space-y-2 flex-1 mb-3.5">
            {card.rewards?.baseRate && (
              <BenefitRow icon="◆" text={card.rewards.baseRate} />
            )}
            {(card.loungeAccess?.domestic > 0 || card.loungeAccess?.international > 0) && (
              <BenefitRow
                icon="✈"
                text={formatLoungeText(card.loungeAccess)}
              />
            )}
            {card.keyFeatures?.[0] && (
              <BenefitRow icon="◆" text={card.keyFeatures[0]} />
            )}
          </div>

          {/* Actions */}
          <div
            className="flex gap-2 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.055)' }}
          >
            <Link
              to={`/cards/${card._id}`}
              className="flex-1 btn-gold text-center py-2.5"
              style={{ fontSize: '0.72rem' }}
            >
              View Card
            </Link>

            {/* Compare */}
            <button
              onClick={handleCompare}
              title={selected ? 'Remove from compare' : 'Compare'}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={
                selected
                  ? { background: 'rgba(201,168,64,0.18)', border: '1px solid rgba(201,168,64,0.5)', color: '#c9a840' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,239,232,0.28)' }
              }
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>

            {/* Favourite */}
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              title={favorited ? 'Remove from collection' : 'Save'}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={
                favorited
                  ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,239,232,0.28)' }
              }
            >
              <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitRow({ icon, text }) {
  return (
    <div className="flex items-start gap-2 text-xs" style={{ color: 'rgba(240,239,232,0.45)' }}>
      <span className="shrink-0 mt-0.5" style={{ color: '#c9a840', fontSize: '0.6rem' }}>{icon}</span>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}

function formatLoungeText(loungeAccess) {
  const dom = loungeAccess.domestic;
  const intl = loungeAccess.international;
  const parts = [];
  if (dom > 0) parts.push(dom >= 999 ? 'Unlimited domestic' : `${dom} domestic`);
  if (intl > 0) parts.push(intl >= 999 ? 'Unlimited intl' : `${intl} intl`);
  return parts.join(' + ') + ' lounge visits';
}
