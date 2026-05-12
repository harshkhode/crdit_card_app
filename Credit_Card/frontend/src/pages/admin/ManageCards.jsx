import { useState, useEffect } from 'react';
import { getCards, deleteCard, createCard, updateCard } from '../../services/cardService';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BANKS = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'IDFC First Bank', 'HSBC Bank'];
const CARD_TYPES = ['rewards', 'cashback', 'travel', 'lifestyle', 'fuel', 'business', 'premium'];

const EMPTY_CARD = {
  name: '', bank: 'HDFC Bank', cardType: 'rewards',
  fees: { joiningFee: 0, annualFee: 0, annualFeeWaiver: '' },
  welcomeBenefits: [''],
  rewards: { baseRate: '', acceleratedRate: '', rewardType: '', redemptionOptions: [] },
  cashback: { baseRate: '', categories: [], maxCashback: '' },
  loungeAccess: { domestic: 0, international: 0, details: '' },
  eligibility: { minIncome: 0, minAge: 21, maxAge: 60, minCreditScore: 700, employmentType: ['salaried'] },
  keyFeatures: [''], pros: [''], cons: [''],
  applyUrl: '', popularity: 50, rating: 4.0,
};

export default function ManageCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [form, setForm] = useState(EMPTY_CARD);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await getCards({ limit: 50, ...(search && { search }) });
      setCards(res.data.data);
    } catch { toast.error('Failed to load cards'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCards(); }, [search]);

  const openAdd = () => { setEditCard(null); setForm(EMPTY_CARD); setShowForm(true); };
  const openEdit = (card) => {
    setEditCard(card);
    setForm({
      ...card,
      welcomeBenefits: card.welcomeBenefits?.length ? card.welcomeBenefits : [''],
      keyFeatures: card.keyFeatures?.length ? card.keyFeatures : [''],
      pros: card.pros?.length ? card.pros : [''],
      cons: card.cons?.length ? card.cons : [''],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this card?')) return;
    try {
      await deleteCard(id);
      toast.success('Card deactivated');
      fetchCards();
    } catch { toast.error('Failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        welcomeBenefits: form.welcomeBenefits.filter(Boolean),
        keyFeatures: form.keyFeatures.filter(Boolean),
        pros: form.pros.filter(Boolean),
        cons: form.cons.filter(Boolean),
      };
      if (editCard) {
        await updateCard(editCard._id, payload);
        toast.success('Card updated!');
      } else {
        await createCard(payload);
        toast.success('Card created!');
      }
      setShowForm(false);
      fetchCards();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const updateArrayField = (field, idx, val) => {
    setForm((f) => ({ ...f, [field]: f[field].map((v, i) => i === idx ? val : v) }));
  };
  const addArrayItem = (field) => setForm((f) => ({ ...f, [field]: [...f[field], ''] }));
  const removeArrayItem = (field, idx) => setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-card text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💳 Manage Cards</h1>
            <p className="text-white/60 mt-1">Add, edit, or remove credit cards</p>
          </div>
          <button onClick={openAdd} className="bg-white text-blue-700 font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
            + Add Card
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <input
          type="text"
          placeholder="Search cards..."
          className="input-field mb-4 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Card Name', 'Bank', 'Type', 'Annual Fee', 'Rating', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cards.map((card, i) => (
                  <tr key={card._id} className={`border-b border-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{card.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{card.bank}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-blue-50 text-blue-600 capitalize text-xs">{card.cardType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(card.fees?.annualFee)}</td>
                    <td className="px-4 py-3 text-sm text-yellow-600">★ {card.rating}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(card)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(card._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto flex items-start justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editCard ? 'Edit Card' : 'Add New Card'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Name *</label>
                  <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank *</label>
                  <select className="input-field" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })}>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Type *</label>
                  <select className="input-field" value={form.cardType} onChange={(e) => setForm({ ...form, cardType: e.target.value })}>
                    {CARD_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" className="input-field" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joining Fee (₹)</label>
                  <input type="number" className="input-field" value={form.fees.joiningFee}
                    onChange={(e) => setForm({ ...form, fees: { ...form.fees, joiningFee: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Fee (₹)</label>
                  <input type="number" className="input-field" value={form.fees.annualFee}
                    onChange={(e) => setForm({ ...form, fees: { ...form.fees, annualFee: e.target.value } })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Reward Rate</label>
                <input className="input-field" value={form.rewards.baseRate}
                  onChange={(e) => setForm({ ...form, rewards: { ...form.rewards, baseRate: e.target.value } })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domestic Lounge</label>
                  <input type="number" className="input-field" value={form.loungeAccess.domestic}
                    onChange={(e) => setForm({ ...form, loungeAccess: { ...form.loungeAccess, domestic: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">International Lounge</label>
                  <input type="number" className="input-field" value={form.loungeAccess.international}
                    onChange={(e) => setForm({ ...form, loungeAccess: { ...form.loungeAccess, international: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Income (₹)</label>
                  <input type="number" className="input-field" value={form.eligibility.minIncome}
                    onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, minIncome: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Credit Score</label>
                  <input type="number" className="input-field" value={form.eligibility.minCreditScore}
                    onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, minCreditScore: e.target.value } })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply URL</label>
                <input className="input-field" value={form.applyUrl} onChange={(e) => setForm({ ...form, applyUrl: e.target.value })} />
              </div>

              {/* Dynamic array fields */}
              {[
                { label: 'Welcome Benefits', field: 'welcomeBenefits' },
                { label: 'Key Features', field: 'keyFeatures' },
                { label: 'Pros', field: 'pros' },
                { label: 'Cons', field: 'cons' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {form[field].map((v, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input className="input-field text-sm" value={v} onChange={(e) => updateArrayField(field, i, e.target.value)} />
                      <button type="button" onClick={() => removeArrayItem(field, i)} className="text-red-400 px-2">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem(field)} className="text-blue-500 text-sm hover:underline">+ Add</button>
                </div>
              ))}
            </form>
            <div className="flex gap-3 p-6 border-t">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : editCard ? 'Update Card' : 'Create Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
