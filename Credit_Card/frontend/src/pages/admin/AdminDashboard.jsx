import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading admin stats..." />;

  const BANK_COLORS = {
    'HDFC Bank': 'bg-blue-500',
    'ICICI Bank': 'bg-orange-500',
    'Axis Bank': 'bg-purple-500',
    'IDFC First Bank': 'bg-green-500',
    'HSBC Bank': 'bg-red-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-card text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">⚙️ Admin Panel</h1>
          <p className="text-white/60 mt-1">Manage cards, users, and platform data</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: '👥', color: 'blue' },
            { label: 'Total Cards', value: stats?.totalCards, icon: '💳', color: 'purple' },
            { label: 'Active Cards', value: stats?.activeCards, icon: '✅', color: 'green' },
            { label: 'Admin Users', value: stats?.adminUsers, icon: '🛡️', color: 'orange' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-3xl font-bold text-gray-800">{s.value ?? '—'}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Cards by bank */}
        {stats?.cardsByBank && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Cards by Bank</h2>
            <div className="space-y-3">
              {stats.cardsByBank.map((b) => (
                <div key={b._id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36 truncate">{b._id}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${BANK_COLORS[b._id] || 'bg-gray-400'}`}
                      style={{ width: `${(b.count / (stats.activeCards || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/cards" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-300 transition-colors group">
            <p className="text-3xl mb-3">💳</p>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600">Manage Cards</h3>
            <p className="text-gray-500 text-sm mt-1">Add, edit, or deactivate credit cards</p>
          </Link>
          <Link to="/admin/users" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-300 transition-colors group">
            <p className="text-3xl mb-3">👥</p>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600">Manage Users</h3>
            <p className="text-gray-500 text-sm mt-1">View, promote, or deactivate user accounts</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
