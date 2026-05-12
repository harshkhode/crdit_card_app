import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites } from '../services/userService';
import CardItem from '../components/CardItem';
import LoadingSpinner from '../components/LoadingSpinner';
import CompareBar from '../components/CompareBar';
import toast from 'react-hot-toast';

export default function Favorites() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites();
      setCards(res.data.data);
    } catch {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const handleFavoriteChange = (isFav, cardId) => {
    if (!isFav) setCards((prev) => prev.filter((c) => c._id !== cardId));
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#030308' }}>
      {/* Header */}
      <div
        className="relative overflow-hidden py-10 px-4"
        style={{
          background: 'linear-gradient(160deg, #030308 0%, #06061a 40%, #080814 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,64,0.07) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, #c9a840)' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#c9a840', letterSpacing: '0.18em' }}>
              My Collection
            </span>
          </div>
          <h1 className="font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f0efe8' }}>
            Saved Cards
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'rgba(240,239,232,0.35)' }}>Your curated premium card collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <LoadingSpinner text="Loading your collection…" />
        ) : cards.length === 0 ? (
          <div className="text-center py-24">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(201,168,64,0.08)', border: '1px solid rgba(201,168,64,0.2)' }}
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: '#c9a840' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="font-bold text-lg mb-2" style={{ color: 'rgba(240,239,232,0.6)' }}>No cards saved yet</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(240,239,232,0.28)' }}>Browse premium cards and tap ♡ to save them here</p>
            <button onClick={() => navigate('/dashboard')} className="btn-gold text-xs">Browse Collection</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-5" style={{ background: 'linear-gradient(90deg, #c9a840, transparent)' }} />
              <p className="text-xs font-medium" style={{ color: 'rgba(240,239,232,0.3)' }}>
                {cards.length} saved card{cards.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cards.map((card) => (
                <CardItem key={card._id} card={card} isFavorited={true} onFavoriteChange={(isFav) => handleFavoriteChange(isFav, card._id)} />
              ))}
            </div>
          </>
        )}
      </div>
      <CompareBar />
    </div>
  );
}
