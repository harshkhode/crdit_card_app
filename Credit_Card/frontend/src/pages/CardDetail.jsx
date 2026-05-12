import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardById } from '../services/cardService';
import { toggleFavorite } from '../services/userService';
import { formatCurrency, getBankGradient, CARD_TYPE_LABELS } from '../utils/helpers';
import useCompareStore from '../store/compareStore';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addCard, removeCard, isSelected } = useCompareStore();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCardById(id);
        setCard(res.data.data);
      } catch {
        toast.error('Card not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Login to save favorites'); return; }
    try {
      await toggleFavorite(id);
      setFavorited(!favorited);
      toast.success(favorited ? 'Removed from favorites' : 'Saved to favorites ❤️');
    } catch { toast.error('Failed'); }
  };

  const handleCompare = () => {
    if (isSelected(id)) {
      removeCard(id);
      toast('Removed from comparison', { icon: '➖' });
    } else {
      const r = addCard(card);
      if (r === 'max') toast.error('Maximum 4 cards can be compared');
      else toast.success('Added to comparison');
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading card details..." />;
  if (!card) return null;

  const gradient = getBankGradient(card.bank);
  const selected = isSelected(id);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className={`bg-gradient-to-br ${gradient} text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-sm flex items-center gap-1 mb-6 transition-colors">
            ← Back
          </button>
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1">
              <p className="text-white/60 text-sm uppercase tracking-wide">{card.bank}</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-1">{card.name}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm capitalize">
                  {CARD_TYPE_LABELS[card.cardType]}
                </span>
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm">
                  ★ {card.rating}
                </span>
              </div>
            </div>

            {/* Card mockup */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 w-72 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-8">
                <p className="text-xs text-white/60 uppercase tracking-wider">{card.bank}</p>
                <span className="text-white/60 text-xl">💳</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-6 rounded bg-yellow-300/80 flex items-center justify-center">
                  <div className="w-5 h-4 rounded-sm border border-yellow-500/50 grid grid-cols-2 gap-0.5 p-0.5">
                    {[...Array(4)].map((_, i) => <div key={i} className="bg-yellow-500/60 rounded-sm" />)}
                  </div>
                </div>
                <p className="text-white/60 font-mono text-sm tracking-widest">•••• ••••</p>
              </div>
              <p className="text-white font-bold text-lg">{card.name}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Joining Fee', value: formatCurrency(card.fees?.joiningFee) },
              { label: 'Annual Fee', value: formatCurrency(card.fees?.annualFee) },
              { label: 'Domestic Lounge', value: card.loungeAccess?.domestic >= 999 ? 'Unlimited' : card.loungeAccess?.domestic + '/year' },
              { label: 'Int\'l Lounge', value: card.loungeAccess?.international >= 999 ? 'Unlimited' : card.loungeAccess?.international + '/year' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-white/60 text-xs mb-1">{s.label}</p>
                <p className="text-white font-bold text-lg">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Action bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href={card.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Apply Now →
          </a>
          <button onClick={handleCompare} className={`btn-secondary ${selected ? 'text-blue-600 border-blue-400' : ''}`}>
            {selected ? '✓ In Comparison' : '+ Compare'}
          </button>
          <button onClick={handleFavorite} className={`btn-secondary ${favorited ? 'text-red-500 border-red-300' : ''}`}>
            {favorited ? '♥ Saved' : '♡ Save'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Welcome Benefits */}
          {card.welcomeBenefits?.length > 0 && (
            <Section title="🎁 Welcome Benefits">
              <ul className="space-y-2">
                {card.welcomeBenefits.map((b, i) => <BulletItem key={i} text={b} color="blue" />)}
              </ul>
            </Section>
          )}

          {/* Rewards */}
          {card.rewards?.baseRate && (
            <Section title="🏆 Rewards Program">
              <InfoRow label="Base Rate" value={card.rewards.baseRate} />
              {card.rewards.acceleratedRate && <InfoRow label="Accelerated" value={card.rewards.acceleratedRate} />}
              {card.rewards.rewardType && <InfoRow label="Type" value={card.rewards.rewardType} />}
              {card.rewards.redemptionOptions?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Redemption Options</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.rewards.redemptionOptions.map((o, i) => (
                      <span key={i} className="badge bg-blue-50 text-blue-600 text-xs">{o}</span>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* Cashback */}
          {card.cashback?.baseRate && (
            <Section title="💰 Cashback">
              <InfoRow label="Base Rate" value={card.cashback.baseRate} />
              {card.cashback.maxCashback && <InfoRow label="Max Monthly" value={card.cashback.maxCashback} />}
              {card.cashback.categories?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Categories</p>
                  <ul className="space-y-1.5">
                    {card.cashback.categories.map((c, i) => <BulletItem key={i} text={c} color="green" />)}
                  </ul>
                </div>
              )}
            </Section>
          )}

          {/* Lounge Access */}
          <Section title="✈️ Lounge Access">
            <InfoRow label="Domestic" value={card.loungeAccess?.domestic >= 999 ? 'Unlimited' : `${card.loungeAccess?.domestic || 0} visits/year`} />
            <InfoRow label="International" value={card.loungeAccess?.international >= 999 ? 'Unlimited' : `${card.loungeAccess?.international || 0} visits/year`} />
            {card.loungeAccess?.details && (
              <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3">{card.loungeAccess.details}</p>
            )}
          </Section>

          {/* Eligibility */}
          <Section title="📋 Eligibility Criteria">
            <InfoRow label="Min. Income" value={formatCurrency(card.eligibility?.minIncome) + '/year'} />
            <InfoRow label="Age" value={`${card.eligibility?.minAge || 21}–${card.eligibility?.maxAge || 60} years`} />
            <InfoRow label="Min. Credit Score" value={card.eligibility?.minCreditScore} />
            {card.eligibility?.employmentType?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Employment Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {card.eligibility.employmentType.map((t, i) => (
                    <span key={i} className="badge bg-purple-50 text-purple-600 capitalize">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Key Features */}
          {card.keyFeatures?.length > 0 && (
            <Section title="⚡ Key Features">
              <ul className="space-y-2">
                {card.keyFeatures.map((f, i) => <BulletItem key={i} text={f} color="blue" />)}
              </ul>
            </Section>
          )}

          {/* Fee Waiver */}
          {card.fees?.annualFeeWaiver && (
            <Section title="💡 Fee Waiver">
              <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">{card.fees.annualFeeWaiver}</p>
            </Section>
          )}

          {/* Pros & Cons */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {card.pros?.length > 0 && (
              <Section title="👍 Pros">
                <ul className="space-y-2">
                  {card.pros.map((p, i) => <BulletItem key={i} text={p} color="green" />)}
                </ul>
              </Section>
            )}
            {card.cons?.length > 0 && (
              <Section title="👎 Cons">
                <ul className="space-y-2">
                  {card.cons.map((c, i) => <BulletItem key={i} text={c} color="red" />)}
                </ul>
              </Section>
            )}
          </div>
        </div>

        {/* Apply CTA */}
        <div className={`mt-8 bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white text-center`}>
          <h3 className="text-xl font-bold mb-2">Ready to apply for {card.name}?</h3>
          <p className="text-white/70 mb-4 text-sm">Click below to apply on the bank's official website</p>
          <a href={card.applyUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Apply Now →
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-base font-bold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function BulletItem({ text, color = 'blue' }) {
  const colors = { blue: 'text-blue-500', green: 'text-green-500', red: 'text-red-500' };
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      <span className={`${colors[color]} mt-0.5 font-bold shrink-0`}>{color === 'red' ? '✗' : '✓'}</span>
      {text}
    </li>
  );
}
