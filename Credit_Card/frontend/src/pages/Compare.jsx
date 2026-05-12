import { useNavigate } from 'react-router-dom';
import useCompareStore from '../store/compareStore';
import { formatCurrency, getBankGradient } from '../utils/helpers';
import CompareBar from '../components/CompareBar';

const ROWS = [
  { label: 'Bank', render: (c) => c.bank },
  { label: 'Card Type', render: (c) => c.cardType },
  { label: 'Joining Fee', render: (c) => formatCurrency(c.fees?.joiningFee) },
  { label: 'Annual Fee', render: (c) => formatCurrency(c.fees?.annualFee) },
  { label: 'Annual Fee Waiver', render: (c) => c.fees?.annualFeeWaiver || '—' },
  { label: 'Base Reward Rate', render: (c) => c.rewards?.baseRate || c.cashback?.baseRate || '—' },
  { label: 'Accelerated Rewards', render: (c) => c.rewards?.acceleratedRate || '—' },
  { label: 'Cashback Max', render: (c) => c.cashback?.maxCashback || '—' },
  { label: 'Domestic Lounge', render: (c) => (c.loungeAccess?.domestic >= 999 ? 'Unlimited' : `${c.loungeAccess?.domestic || 0}/year`) },
  { label: 'International Lounge', render: (c) => (c.loungeAccess?.international >= 999 ? 'Unlimited' : `${c.loungeAccess?.international || 0}/year`) },
  { label: 'Min. Income', render: (c) => formatCurrency(c.eligibility?.minIncome) + '/yr' },
  { label: 'Min. Credit Score', render: (c) => c.eligibility?.minCreditScore },
  { label: 'Age Range', render: (c) => `${c.eligibility?.minAge || 21}–${c.eligibility?.maxAge || 60}` },
  { label: 'Rating', render: (c) => `★ ${c.rating}` },
];

export default function Compare() {
  const { selectedCards, removeCard, clearAll } = useCompareStore();
  const navigate = useNavigate();

  if (selectedCards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">⇄</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No cards selected</h2>
          <p className="text-gray-500 mb-6">Go to dashboard and select up to 4 cards to compare</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">Browse Cards</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="gradient-card text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Compare Cards</h1>
            <p className="text-white/60 mt-1">Side-by-side comparison of {selectedCards.length} cards</p>
          </div>
          <button onClick={clearAll} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-colors">
            Clear All
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-gray-500 text-sm font-medium w-40 sticky left-0 bg-gray-50">
                Feature
              </th>
              {selectedCards.map((card) => {
                const gradient = getBankGradient(card.bank);
                return (
                  <th key={card._id} className="px-4 py-3 text-center min-w-[200px]">
                    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white relative`}>
                      <button
                        onClick={() => removeCard(card._id)}
                        className="absolute top-2 right-2 text-white/60 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                      <p className="text-white/60 text-xs">{card.bank}</p>
                      <p className="font-bold mt-0.5 text-sm leading-tight">{card.name}</p>
                      <p className="text-yellow-300 text-xs mt-1">★ {card.rating}</p>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, idx) => (
              <tr key={row.label} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="py-3 px-4 text-sm font-medium text-gray-600 sticky left-0 bg-inherit border-r border-gray-100">
                  {row.label}
                </td>
                {selectedCards.map((card) => (
                  <td key={card._id} className="py-3 px-4 text-sm text-gray-800 text-center">
                    {row.render(card)}
                  </td>
                ))}
              </tr>
            ))}
            {/* Pros row */}
            <tr className="bg-white">
              <td className="py-3 px-4 text-sm font-medium text-gray-600 sticky left-0 bg-white border-r border-gray-100">Pros</td>
              {selectedCards.map((card) => (
                <td key={card._id} className="py-3 px-4 text-xs text-gray-700">
                  <ul className="space-y-1">
                    {card.pros?.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-green-500 shrink-0">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            {/* Cons row */}
            <tr className="bg-gray-50/50">
              <td className="py-3 px-4 text-sm font-medium text-gray-600 sticky left-0 bg-gray-50/50 border-r border-gray-100">Cons</td>
              {selectedCards.map((card) => (
                <td key={card._id} className="py-3 px-4 text-xs text-gray-700">
                  <ul className="space-y-1">
                    {card.cons?.slice(0, 3).map((c, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-red-400 shrink-0">✗</span>{c}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            {/* Apply row */}
            <tr className="bg-white">
              <td className="py-3 px-4 text-sm font-medium text-gray-600 sticky left-0 bg-white border-r border-gray-100">Apply</td>
              {selectedCards.map((card) => (
                <td key={card._id} className="py-3 px-4 text-center">
                  <a
                    href={card.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block btn-primary text-xs py-2 px-4"
                  >
                    Apply Now
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <CompareBar />
    </div>
  );
}
