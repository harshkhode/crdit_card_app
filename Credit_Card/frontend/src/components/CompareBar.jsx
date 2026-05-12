import { useNavigate } from 'react-router-dom';
import useCompareStore from '../store/compareStore';

export default function CompareBar() {
  const { selectedCards, removeCard, clearAll } = useCompareStore();
  const navigate = useNavigate();

  if (selectedCards.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3"
      style={{
        background: 'rgba(8,8,20,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(201,168,64,0.2)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
      }}
    >
      {/* Gold top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,64,0.5) 30%, rgba(240,200,96,0.7) 50%, rgba(201,168,64,0.5) 70%, transparent)' }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Selected cards */}
        <div className="flex items-center gap-3 overflow-x-auto flex-1 scrollbar-hide">
          <span
            className="text-xs font-bold uppercase tracking-widest whitespace-nowrap shrink-0"
            style={{ color: 'rgba(201,168,64,0.7)', letterSpacing: '0.12em' }}
          >
            Compare ({selectedCards.length}/4)
          </span>
          <div className="flex gap-2">
            {selectedCards.map((card) => (
              <div
                key={card._id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl whitespace-nowrap"
                style={{ background: 'rgba(201,168,64,0.08)', border: '1px solid rgba(201,168,64,0.2)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'rgba(240,239,232,0.7)' }}>{card.name}</span>
                <button
                  onClick={() => removeCard(card._id)}
                  className="w-4 h-4 rounded-full flex items-center justify-center transition-colors ml-0.5"
                  style={{ color: 'rgba(201,168,64,0.5)', fontSize: '0.65rem', lineHeight: 1 }}
                  onMouseEnter={(e) => (e.target.style.color = '#c9a840')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(201,168,64,0.5)')}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearAll}
            className="btn-ghost text-xs py-2 px-3"
          >
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={selectedCards.length < 2}
            className="btn-gold text-xs py-2 px-5 disabled:opacity-40"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}
